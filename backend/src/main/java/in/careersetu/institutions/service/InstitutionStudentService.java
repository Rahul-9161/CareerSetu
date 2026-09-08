package in.careersetu.institutions.service;

import in.careersetu.institutions.entity.InstitutionStudent;
import in.careersetu.institutions.repository.InstitutionStudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class InstitutionStudentService {

    private final InstitutionStudentRepository studentRepository;

    public InstitutionStudentService(InstitutionStudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<InstitutionStudent> getStudents(String department, String nepStatus, String search) {
        if (department != null && department.trim().isEmpty()) department = null;
        if (nepStatus != null && (nepStatus.trim().isEmpty() || nepStatus.equalsIgnoreCase("ALL"))) nepStatus = null;
        if (search != null && search.trim().isEmpty()) search = null;

        return studentRepository.findWithFilters(department, nepStatus, search);
    }

    public Optional<InstitutionStudent> getStudentById(UUID id) {
        return studentRepository.findById(id);
    }

    @Transactional
    public Map<String, Object> bulkUploadCsv(MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        if (file.isEmpty()) {
            result.put("success", false);
            result.put("message", "Uploaded CSV file is empty");
            result.put("importedCount", 0);
            return result;
        }

        List<InstitutionStudent> studentsToSave = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int lineNum = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            String[] headers = null;

            while ((line = reader.readLine()) != null) {
                lineNum++;
                line = line.trim();
                if (line.isEmpty()) continue;

                String[] tokens = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                for (int i = 0; i < tokens.length; i++) {
                    tokens[i] = tokens[i].trim().replaceAll("^\"|\"$", "");
                }

                if (lineNum == 1) {
                    headers = tokens;
                    continue;
                }

                if (tokens.length < 4) {
                    errors.add("Line " + lineNum + ": Insufficient columns (expected at least Name, Email, RollNo, Department)");
                    continue;
                }

                try {
                    String name = tokens[0];
                    String email = tokens[1];
                    String rollNo = tokens[2];
                    String dept = tokens[3];
                    int year = tokens.length > 4 && !tokens[4].isEmpty() ? Integer.parseInt(tokens[4]) : 4;
                    double cgpa = tokens.length > 5 && !tokens[5].isEmpty() ? Double.parseDouble(tokens[5]) : 7.5;
                    int nepCredits = tokens.length > 6 && !tokens[6].isEmpty() ? Integer.parseInt(tokens[6]) : 0;
                    String placementStatus = tokens.length > 7 && !tokens[7].isEmpty() ? tokens[7] : "NOT_APPLIED";
                    String placedCompany = tokens.length > 8 && !tokens[8].isEmpty() ? tokens[8] : null;
                    Double placedPackage = tokens.length > 9 && !tokens[9].isEmpty() ? Double.parseDouble(tokens[9]) : null;

                    Optional<InstitutionStudent> existing = studentRepository.findByRollNo(rollNo);
                    InstitutionStudent student;
                    if (existing.isPresent()) {
                        student = existing.get();
                        student.setName(name);
                        student.setEmail(email);
                        student.setDepartment(dept);
                        student.setYear(year);
                        student.setCgpa(cgpa);
                        student.setNepCredits(nepCredits);
                        student.setPlacementStatus(placementStatus);
                        student.setPlacedCompany(placedCompany);
                        student.setPlacedPackageLpa(placedPackage);
                    } else {
                        student = new InstitutionStudent(
                                name, email, rollNo, dept, year, cgpa, nepCredits,
                                null, 0, placementStatus, placedCompany, placedPackage
                        );
                    }

                    studentsToSave.add(student);
                } catch (Exception ex) {
                    errors.add("Line " + lineNum + ": " + ex.getMessage());
                }
            }

            if (!studentsToSave.isEmpty()) {
                studentRepository.saveAll(studentsToSave);
            }

            result.put("success", true);
            result.put("totalLines", lineNum);
            result.put("importedCount", studentsToSave.size());
            result.put("errorCount", errors.size());
            result.put("errors", errors);
            result.put("message", "Successfully imported " + studentsToSave.size() + " students");

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Failed to parse CSV: " + e.getMessage());
            result.put("importedCount", 0);
        }

        return result;
    }

    public Map<String, Object> getInstitutionStats() {
        List<InstitutionStudent> allStudents = studentRepository.findAll();
        long total = allStudents.size();
        if (total == 0) {
            return Map.of(
                    "totalStudents", 0,
                    "avgCgpa", 0.0,
                    "nepCompliantPercentage", 0.0,
                    "placementPercentage", 0.0,
                    "totalPlaced", 0
            );
        }

        double avgCgpa = allStudents.stream().mapToDouble(InstitutionStudent::getCgpa).average().orElse(0.0);
        long compliantCount = allStudents.stream().filter(s -> "COMPLIANT".equalsIgnoreCase(s.getNepStatus())).count();
        long placedCount = allStudents.stream().filter(s -> "PLACED".equalsIgnoreCase(s.getPlacementStatus()) || s.getPlacedCompany() != null).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", total);
        stats.put("avgCgpa", Math.round(avgCgpa * 100.0) / 100.0);
        stats.put("nepCompliantPercentage", Math.round(((double) compliantCount / total) * 1000.0) / 10.0);
        stats.put("placementPercentage", Math.round(((double) placedCount / total) * 1000.0) / 10.0);
        stats.put("totalPlaced", placedCount);
        stats.put("nepCompliantCount", compliantCount);

        return stats;
    }
}
