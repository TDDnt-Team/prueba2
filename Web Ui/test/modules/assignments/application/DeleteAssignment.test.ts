import { DeleteAssignment } from "../../../../src/modules/Assignments/application/DeleteAssignment";
import { AssignmentDataObject } from "../../../../src/modules/Assignments/domain/assignmentInterfaces";
import { MockAssignmentsRepository } from "../../__mocks__/mockAssignmentsRepository";

let mockRepository: MockAssignmentsRepository;
let deleteAssignment: DeleteAssignment;
beforeEach(() => {
    mockRepository = new MockAssignmentsRepository();
    deleteAssignment = new DeleteAssignment(mockRepository);
});
describe("Create Assignment", () => {
    it("Should successfully create a new assignment", async () => {
        const assignmentId = 1;
        const assignment: AssignmentDataObject = {
            id: assignmentId,
            title: "Tarea Test",
            description: "Esta es una tarea de prueba",
            start_date: new Date("2023-10-31"),
            end_date: new Date("2023-11-05"),
            state: "inProgress",
            link: "Enlace",
        };
        mockRepository.createAssignment(assignment);
        const obtainedAssignment = await deleteAssignment.deleteAssignment(1);
        expect(obtainedAssignment).toEqual('Succesful deletion');
    });
});