import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const categories = [
  { id: 2, categoryName: "Laptop" },
  { id: 6, categoryName: "Headphone" },
  { id: 1, categoryName: "Mobile" },
  { id: 5, categoryName: "Electronics" },
  { id: 4, categoryName: "Toys" },
  { id: 3, categoryName: "Fashion" },
];

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: { id: 0, categoryName: "" },
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
    imageType: "",
    imageBase64: ""
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/${id}`
      );

      setProduct(response.data.data);
      setUpdateProduct(response.data.data);
      const imageFile = await base64ToFile(response.data.data.imageBase64, response.data.data.imageName, response.data.data.imageType)
      setImage(imageFile);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const base64ToFile = async (base64String, fileName, mimeType) => {
    // Decode Base64 string into raw binary data
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Convert to Uint8Array (raw binary data)
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from binary data
    const blob = new Blob([byteArray], { type: mimeType });

    // Convert Blob to File
    return new File([blob], fileName, { type: mimeType });
  };

  const convertUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("images", image)
    console.log("productsdfsfsf", updateProduct)
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );


    console.log("formData : ", updatedProduct)
    axios
      .post(`http://localhost:8080/api/products`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product updated successfully:", updatedProduct);
        alert("Product updated successfully!");
        fetchProduct();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        console.log("product unsuccessfull update", updateProduct)
        alert("Failed to update product. Please try again.");
      });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleCategoryInputChange = (event) => {
    const selectedCategoryId = parseInt(event.target.value);
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId) || null;
    setUpdateProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedCategory,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  return (
    <div className="update-product-container" >
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.name}
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder={product.brand}
              value={updateProduct.brand}
              onChange={handleChange}
              id="brand"
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.description}
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
              id="description"
            />
          </div>
          <div className="col-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              value={updateProduct.price}
              placeholder={product.price}
              name="price"
              id="price"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={updateProduct.category?.id || ""}
              onChange={handleCategoryInputChange}
              name="category"
              id="category"
            >
              <option value="">Select category</option>
              {
                categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.categoryName}</option>
                ))
              }
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              placeholder={product.stockQuantity}
              value={updateProduct.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            <img
              src={`data:${updateProduct.imageType};base64, ${updateProduct.imageBase64}`}
              alt={product.imageName}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                padding: "5px",
                margin: "0",
              }}
            />
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              placeholder="Upload image"
              name="imageUrl"
              id="imageUrl"
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="gridCheck"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;