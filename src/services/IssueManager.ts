import { CommunityIssue, IssueCategory, IssueStatus } from './types';

export class IssueManager {
  private issues: CommunityIssue[] = [];

  // Create a new community report
  public reportIssue(
    title: string,
    description: string,
    category: IssueCategory,
    lat: number,
    lng: number,
    userId: string
  ): CommunityIssue {
    const newIssue: CommunityIssue = {
      id: crypto.randomUUID(), // Generates a unique secure ID
      title,
      description,
      category,
      status: 'OPEN',
      latitude: lat,
      longitude: lng,
      reportedBy: userId,
      upvotes: 0,
      votedUserIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.issues.push(newIssue);
    return newIssue;
  }

  // Upvote logic ensuring a user can only vote once
  public upvoteIssue(issueId: string, userId: string): boolean {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return false;

    // Check if user already voted
    if (issue.votedUserIds.includes(userId)) {
      return false; // Action rejected
    }

    issue.upvotes += 1;
    issue.votedUserIds.push(userId);
    issue.updatedAt = new Date();
    return true;
  }

  // Fetch issues sorted by urgency (highest upvotes first)
  public getTrendingIssues(): CommunityIssue[] {
    return [...this.issues].sort((a, b) => b.upvotes - a.upvotes);
  }
}
