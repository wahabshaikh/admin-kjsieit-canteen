import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { db, storage } from "../../firebase";
import validateMenuItem from "./validateMenuItem";

import {
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  Link,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

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

const AddMenuItem = () => {
  const classes = useStyles();
  const history = useHistory();

  const [menuItem, setMenuItem] = useState({
    name: "",
    image_url: "",
    price: "",
    category: "",
    isAvailable: true,
  });
  const [image, setImage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    db.collection("categories")
      .get()
      .then((snapshot) => {
        const categories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categories);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    e.persist();
    if (e.target.name === "price") {
      setMenuItem((previousMenuItems) => ({
        ...previousMenuItems,
        price: Number(e.target.value),
      }));
    } else if (e.target.name === "image") {
      setImage(e.target.files[0]);
    } else {
      setMenuItem((previousMenuItems) => ({
        ...previousMenuItems,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateMenuItem(menuItem);
    if (Object.keys(errors).length === 0) {
      const name = menuItem.name.toLowerCase().replace(" ", "_");
      storage
        .ref(`/menu_items/${menuItem.category.replace(" ", "_")}/${name}`)
        .put(image)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            db.collection("menu")
              .doc(name)
              .set({ ...menuItem, image_url: url })
              .then(() => {
                setMenuItem({
                  name: "",
                  image_url: "",
                  price: "",
                  category: "",
                  isAvailable: true,
                });
                history.push("/menu");
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
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        <Link component={RouterLink} to="/menu">
          Menu
        </Link>
        <Typography color="textPrimary">Add</Typography>
      </Breadcrumbs>

      {errors.firebase && (
        <Typography className={classes.errorText}>{errors.firebase}</Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.input}
          error={isError && errors.name}
          fullWidth
          label="Name"
          name="name"
          onChange={handleChange}
          value={menuItem.name}
          variant="outlined"
          required
        />
        {errors.name && (
          <Typography className={classes.errorText}>{errors.name}</Typography>
        )}

        <TextField
          name="image"
          type="file"
          onChange={handleChange}
          variant="outlined"
          defaultValue=""
        />

        <TextField
          className={classes.input}
          error={isError && errors.price}
          fullWidth
          label="Price"
          name="price"
          onChange={handleChange}
          type="number"
          value={menuItem.price}
          variant="outlined"
          required
        />
        {errors.price && (
          <Typography className={classes.errorText}>{errors.price}</Typography>
        )}

        <FormControl
          className={classes.input}
          error={isError && errors.price}
          fullWidth
          variant="outlined"
          required
        >
          <InputLabel id="category">Category</InputLabel>
          <Select
            labelId="category"
            name="category"
            value={menuItem.category}
            onChange={handleChange}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <Typography className={classes.errorText}>
              {errors.category}
            </Typography>
          )}
        </FormControl>

        <Button variant="contained" onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AddMenuItem;
