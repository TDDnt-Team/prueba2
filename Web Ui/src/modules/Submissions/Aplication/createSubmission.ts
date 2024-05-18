import { SubmissionCreationObject } from "../Domain/submissionInterfaces";
import SubmissionRepositoryInterface from "../Domain/SubmissionRepositoryInterface";

export class CreateSubmission {
    constructor(private submissionRepository: SubmissionRepositoryInterface) {}

    async createSubmission(submissionData: SubmissionCreationObject) {
        return await this.submissionRepository.createSubmission(submissionData)
    }
}