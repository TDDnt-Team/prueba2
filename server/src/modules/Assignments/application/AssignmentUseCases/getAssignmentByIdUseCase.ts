import { AssignmentDataObject } from "../../domain/Assignment";
import AssignmentRepository from "../../repositories/AssignmentRepository";

class GetAssignmentById {
  private adapter: AssignmentRepository;

  constructor(adapter: AssignmentRepository) {
    this.adapter = adapter;
  }

  async execute(assignmentId: string): Promise<AssignmentDataObject | null> {
    try {
      const assignment = await this.adapter.obtainAssignmentById(assignmentId);
      return assignment;
    } catch (error) {
      //console.error("Error fetching assignment:", error);

      throw error;
    }
  }
}

export default GetAssignmentById;
