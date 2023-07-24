'use client';
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import { SafeBrand, SafeCategory, SafeUser } from "../types";
import getCategories from "../actions/getCategories";
import getBrands from "../actions/getBrands";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BrandsClientProps {
  brands: SafeBrand[];
  categories: SafeCategory[];
  currentUser: SafeUser;
}

const BrandsClient: React.FC<BrandsClientProps> = ({
  brands,
  categories,
  currentUser
}) => {
  //const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [siteURL, setSiteURL] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [logo, setLogo] = useState('');
  const [email, setEmail] = useState('');
  const [category_id, setCategory_id] = useState('');


  useEffect(() => {
    fetchBrands();
  }, []);
   const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/brands');
      //setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };
   const createBrand = async () => {
    try {
      const response = await axios.post('/api/brands', {
        name,
        description,
        siteURL,
        bannerImage,
        logo,
        email,
        category_id
      });
      //setCategories([...categories, response.data]);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };
   const updateBrand = async (brandId: string) => {
    try {
      const response = await axios.put( `/api/brands/${brandId}` , {
        name,
        description,
      });
      const updatedBrands = brands.map((brand) =>
        brand.id === brandId ? response.data : brand
      );
      //setCategories(updatedCategories);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };
   const deleteBrand = async (brandId: string) => {
    try {
      await axios.delete( `/api/brands/${brandId}` );
      const updatedBrands = brands.filter(
        (brand) => brand.id !== brandId
      );
      //setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };
   return (
    <Container>
      <Heading title="Brands"/>
      <form onSubmit={createBrand}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="text"
          value={siteURL}
          onChange={(e) => setSiteURL(e.target.value)}
          placeholder="SiteURL"
        />
        <input
          type="text"
          value={bannerImage}
          onChange={(e) => setBannerImage(e.target.value)}
          placeholder="BannerImage"
        />
        <input
          type="text"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="Logo"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <select value={category_id} onChange={(e) => setCategory_id(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button type="submit">
          Create
        </button>
      </form>
      <table className="table-auto">
      <thead>
        <tr>
          <th>Brand Name</th>
          <th>Description</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {brands.map((brand) => (
        <tr key={brand.id}>
          <td><h2>{brand.name}</h2></td>
          <td><p>{brand.description}</p></td>
          <td><button onClick={() => updateBrand(brand.id)}>
            Update
          </button></td>
          <td><button onClick={() => deleteBrand(brand.id)}>
            Delete
          </button></td>
        </tr>
      ))}</tbody></table>
    </Container>
  );
}
 export default BrandsClient;