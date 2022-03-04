import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useState, useEffect } from "react";

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editingFood, setEditingFood] = useState({} as FoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function fetchFoods(): Promise<void> {
      const response = await api.get("/foods");
      setFoods(response.data);
    }

    fetchFoods();
  }, [foods]);

  const handleAddFood = async (
    food: Omit<FoodProps, "id" | "available">
  ): Promise<void> => {
    try {
      const { name, description, image, price } = food;
      const response = await api.post("/foods", {
        name,
        description,
        image,
        price,
        available: true,
      });

      /* console.log(response); */

      setFoods((state) => [...state, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (
    food: Omit<FoodProps, "id" | "available">
  ): Promise<void> => {
    const { name, description, price, image } = food;
    const { id } = editingFood;
    try {
      const foodUpdated = await api.put(`/foods/${id}`, {
        name,
        description,
        price,
        image,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number): Promise<void> => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleModal = (): void => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = (): void => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: FoodProps): void => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
