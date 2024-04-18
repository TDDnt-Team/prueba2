import AssignmentsRepositoryInterface from "../domain/AssignmentsRepositoryInterface";
import { AssignmentDataObject } from "../domain/assignmentInterfaces";

export class GetAssignmentsByGroupId {
  constructor(private assignmentsRepository: AssignmentsRepositoryInterface) {}

  async obtainAssignmentsByGroupId(groupId: number): Promise<AssignmentDataObject[]> {
    try {
      return await this.assignmentsRepository.getAssignmentsByGroupId(groupId);
    } catch (error) {
      console.error("Error fetching assignments by group ID:", error);
      throw error;
    } 
    
  }
}