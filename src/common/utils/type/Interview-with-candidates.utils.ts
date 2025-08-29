import { Interviews } from "src/interviews/entities/interview.schema";
import { ShortlistedCandidates } from "src/shortlisted-candidate/entities/shortlisted-candidates.schema";

export type InterviewWithCandidate = Omit<Interviews, 'candidate'> & {
  candidate: ShortlistedCandidates;
};