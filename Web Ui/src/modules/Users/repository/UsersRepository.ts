import axios from "axios";
import { UserDataObject } from "../domain/UsersInterface";
import UsersRepositoryInterface from "../domain/UsersRepositoryInterface";

const API_URL = "http://localhost:3000/api/user/users"; //tdd-lab-api-gold.vercel.app

class UsersRepository implements UsersRepositoryInterface {
  async getUsers(): Promise<UserDataObject[]> {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  async getUsersByGroupid(groupid: number): Promise<UserDataObject[]>{
    try{
      const response = await axios.get(`${API_URL}/groupid/${groupid}`);
      return response.data;
    }catch(error){
      console.error("Error fetching users by group ID:", error);
      throw error
    }

  }
}

export default UsersRepository;