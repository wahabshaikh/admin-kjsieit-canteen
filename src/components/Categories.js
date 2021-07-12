import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { db, storage } from "../firebase";
import validate from "../utils/validate";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(3),
  },
  input: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  errorText: {
    color: red[500],
  },
}));

const Categories = () => {
  const classes = useStyles();

  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const unsubscribe = db.collection("categories").onSnapshot((snapshot) => {
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categories);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = {};
    if (!categoryName) {
      errors.categoryName = "Category name required";
    } else if (categoryName.length < 3) {
      errors.categoryName = "Category name must be atleast 3 characters";
    }

    if (Object.keys(errors).length === 0) {
      const name = categoryName.toLowerCase().replace(" ", "_");
      storage
        .ref(`/categories/${name}`)
        .put(image)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            db.collection("categories")
              .add({
                name,
                image_url: url,
              })
              .then(() => {
                setCategoryName("");
              })
              .catch((error) => setErrors({ firebase: error.message }));
          });
        })
        .catch((error) => setErrors({ firebase: error.message }));
    } else {
      setIsError(true);
      setErrors(errors);
    }
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.input}
          error={isError && errors.name}
          fullWidth
          label="Name"
          name="name"
          onChange={(e) => setCategoryName(e.target.value)}
          value={categoryName}
          variant="outlined"
          required
        />
        {errors.name && (
          <Typography className={classes.errorText}>{errors.name}</Typography>
        )}

        <TextField
          name="image"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          variant="outlined"
          defaultValue=""
        />

        <div className={classes.input}>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </div>
      </form>

      <Typography variant="h4" color="textSecondary">
        Categories
      </Typography>

      <List>
        {categories.map((category) => (
          <ListItem>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Categories;
