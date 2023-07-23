'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import { SafeCategory, SafeUser } from "../types";

interface CategoriesClientProps {
  categories: SafeCategory[];
  currentUser: SafeUser;
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({
  categories,
  currentUser
}) => {
  //const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  useEffect(() => {
    fetchCategories();
  }, []);

   const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      //setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
   const createCategory = async () => {
    try {
      const response = await axios.post('/api/categories', {
        name,
        description,
      });
      //setCategories([...categories, response.data]);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };
   const updateCategory = async (categoryId: string) => {
    try {
      const response = await axios.put( `/api/categories/${categoryId}` , {
        name,
        description,
      });
      const updatedCategories = categories.map((category) =>
        category.id === categoryId ? response.data : category
      );
      //setCategories(updatedCategories);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
   const deleteCategory = async (categoryId: string) => {
    try {
      await axios.delete( `/api/categories/${categoryId}` );
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryId
      );
      //setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
   return (
    <Container>
      <Heading title="Categories" />
      <form onSubmit={createCategory}>
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
        <button type="submit">
          Create
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {categories.map((category) => (
        <div key={category.id}>
          <tr>
          <td><h2>{category.name}</h2></td>
          <td><p>{category.description}</p></td>
          <td><button onClick={() => updateCategory(category.id)}>
            Update
          </button></td>
          <td><button onClick={() => deleteCategory(category.id)}>
            Delete
          </button></td>
          </tr>
        </div>
      ))}
        </tbody>
      </table>
    </Container>
  );
}
 export default CategoriesClient;