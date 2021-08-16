const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
//verify that the dish data exists
const dishExists = (req, res, next) => {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  //if the dish is found use res.locals so it can be used
  if (foundDish) {
    res.locals.foundDish = foundDish;
    next();
  }
  next({
    status: 404,
    message: `Dish with id ${dishId} does not exist.`,
  });
};

const validateDish = (req, res, next) => {
  const {
    data: { name, description, price, image_url },
  } = req.body;

  //Dish must include a name
  if (!name || name == "")
    return next({ status: 400, message: "Dish must include a name" });
  //Dish must include a description
  if (!description || description == "")
    return next({ status: 400, message: "Dish must include a description" });
  //Dish must include a price
  if (!price)
    return next({ status: 400, message: "Dish must include a price" });
  //Dish must have a price that is an integer greater than 0
  if (typeof price !== "number" || price <= 0)
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  //Dish must include a image_url
  if (!image_url || image_url == "")
    return next({ status: 400, message: "Dish must include an image_url" });
  else {
    res.locals.newDish = {
      id: nextId(),
      name: name,
      description: description,
      price: price,
      image_url: image_url,
    };
    next();
  }
};

const create = (req, res, next) => {
  dishes.push(res.locals.newDish);
  res.status(201).json({ data: res.locals.newDish });
};

const read = (req, res, next) => {
  res.json({ data: res.locals.foundDish });
};

const list = (req, res, next) => {
  res.json({ data: dishes });
};

const update = (req, res, next) => {
  const originalDish = res.locals.foundDish;
  const {
    data: { id, name, price, description, image_url },
  } = req.body;
  if (id && id !== req.params.dishId)
    return next({
      status: 400,
      message: `Dish id ${id} does not match dish id ${req.params.dishId}`,
    });

  res.locals.foundDish = {
    id: originalDish.id,
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  res.json({ data: res.locals.foundDish });
};

module.exports = {
  dishExists,
  list,
  create: [validateDish, create],
  read: [dishExists, read],
  update: [dishExists, validateDish, update],
};
