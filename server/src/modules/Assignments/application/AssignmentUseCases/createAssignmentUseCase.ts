import { AssignmentCreationObject } from "../../domain/Assignment";
import AssignmentRepository from "../../repositories/AssignmentRepository";

class CreateAssignment {
  private adapter: AssignmentRepository;

  constructor(adapter: AssignmentRepository) {
    this.adapter = adapter;
  }

  async execute(
    assignment: Omit<AssignmentCreationObject, "id">
  ): Promise<AssignmentCreationObject> {
    try {
      if (!this.adapter.groupidExistsForAssigment(assignment.groupid)) {
        throw new Error("Inexistent group ID");
      }
      const newAssignment = await this.adapter.createAssignment(assignment);
      return newAssignment;

    } catch (error) {
      throw error;
    }
  }
}

export default CreateAssignment;
