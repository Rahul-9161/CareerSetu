package in.careersetu.grievances.dto;

public class GrievanceDtos {

    public record CreateGrievanceRequest(
            String category,
            String priority,
            String subject,
            String description
    ) {}

    public record ResolveGrievanceRequest(
            String status,
            String remarks,
            String resolutionRemarks,
            String officerName
    ) {
        public String getEffectiveRemarks() {
            if (remarks != null && !remarks.isBlank()) return remarks;
            if (resolutionRemarks != null && !resolutionRemarks.isBlank()) return resolutionRemarks;
            return "Grievance adjudicated and resolved under DPDP Act statutory provisions.";
        }
    }

    public record GrievanceStatsResponse(
            long totalGrievances,
            long openGrievances,
            long resolvedGrievances,
            long dpdpRequestsCount,
            double avgResolutionDays
    ) {}
}
