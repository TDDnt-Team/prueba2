import axios from "axios";
import { GroupDataObject } from "../domain/GroupInterface";
import GroupsRepositoryInterface from "../domain/GroupsRepositoryInterface";

// const API_URL = import.meta.env.VITE_API_URL + '/groups';
const API_URL = 'https://server-j5eecmodv-dilan-alavis-projects.vercel.app/api' + '/groups'; // Staging API URL

class GroupsRepository implements GroupsRepositoryInterface {
  async getGroups(): Promise<GroupDataObject[]> {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  }

  async getGroupById(id: number): Promise<GroupDataObject | null> {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching group by ID:", error);
      throw error;
    }
  }

  async createGroup(groupData: GroupDataObject): Promise<void> {
    try {
      await axios.post(API_URL, groupData);
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  }

  async deleteGroup(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting group:", error);
      throw error;
    }
  }
}

export default GroupsRepository;
