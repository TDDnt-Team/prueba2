import { UserOnDb } from "../domain/userOnDb.interface";
import AuthRepository from "../repository/LoginRepository";
import {VITE_API} from "../../../../config.ts";

export class CheckIfUserHasAccount {
  adapter: AuthRepository;
  constructor(loginRepository: AuthRepository = new AuthRepository()) {
    this.adapter = loginRepository;
  }

  async userHasAnAccount(email: string) {
    console.log("API= " + VITE_API)
    try {
      const answerData: UserOnDb = await this.adapter.getAccountInfo(email);
      console.log('User data retrieved:', answerData);
      
      if (answerData.groupid) {
        console.log('User has a group ID:', answerData.groupid);
        return answerData;
      } else {
        console.log('User does not have a group ID.', answerData);
        return null;
      }
    } catch (error) {
      console.error('Error checking user account:', error);
      throw error; // Ensure the error is propagated
    }
  }
}