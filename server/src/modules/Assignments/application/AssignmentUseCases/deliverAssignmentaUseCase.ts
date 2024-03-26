import AssignmentRepository from "../../repositories/AssignmentRepository";
import { AssignmentDataObject } from "../../domain/Assignment";

class DeliverAssignmentUseCase {
  private repository: AssignmentRepository;

  constructor(repository: AssignmentRepository) {
    this.repository = repository;
  }

  async execute(
    assignmentId: string,
    link: string,
    comment: string
    // groupId: number, //Modified DeliverAssignment because of tests completions
  ): Promise<AssignmentDataObject | null> {
    try {
      const assignment = await this.repository.obtainAssignmentById(
        assignmentId
      );

      if (!assignment) {
        return null;
      }

      // Update the assignment's state and link
      assignment.link = link;

      if (assignment.state == "pending") {
        assignment.state = "in progress";
      } else {
        assignment.comment = comment;
        assignment.state = "delivered";
        // Set the comment property
      }

      // Update the assignment in the repository
      await this.repository.updateAssignment(assignmentId, assignment);

      return assignment;
    } catch (error) {
      //console.error("Error delivering assignment:", error);
      throw error;
    }
  }
}

export default DeliverAssignmentUseCase;
