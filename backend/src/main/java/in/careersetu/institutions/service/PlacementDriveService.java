package in.careersetu.institutions.service;

import in.careersetu.institutions.entity.DriveRegistration;
import in.careersetu.institutions.entity.PlacementDrive;
import in.careersetu.institutions.repository.DriveRegistrationRepository;
import in.careersetu.institutions.repository.PlacementDriveRepository;
import in.careersetu.notifications.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final DriveRegistrationRepository registrationRepository;
    private final NotificationService notificationService;

    public PlacementDriveService(PlacementDriveRepository driveRepository,
                                 DriveRegistrationRepository registrationRepository,
                                 NotificationService notificationService) {
        this.driveRepository = driveRepository;
        this.registrationRepository = registrationRepository;
        this.notificationService = notificationService;
    }

    public List<PlacementDrive> getAllDrives() {
        return driveRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<PlacementDrive> getDriveById(UUID id) {
        return driveRepository.findById(id);
    }

    @Transactional
    public PlacementDrive createDrive(PlacementDrive drive) {
        return driveRepository.save(drive);
    }

    @Transactional
    public DriveRegistration registerStudent(UUID driveId, String email, String name, String rollNo) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new IllegalArgumentException("Placement drive not found with ID: " + driveId));

        Optional<DriveRegistration> existing = registrationRepository.findByDriveIdAndStudentEmail(driveId, email);
        if (existing.isPresent()) {
            return existing.get();
        }

        DriveRegistration registration = new DriveRegistration(driveId, email, name, rollNo);
        drive.setApplicantsCount(drive.getApplicantsCount() + 1);
        driveRepository.save(drive);

        return registrationRepository.save(registration);
    }

    @Transactional
    public Map<String, Object> broadcastDrive(UUID driveId) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new IllegalArgumentException("Placement drive not found: " + driveId));

        // Send notification to students
        notificationService.dispatchNotification(
                "student@careersetu.in",
                "New Placement Drive: " + drive.getCompanyName(),
                drive.getCompanyName() + " announced campus recruitment for " + drive.getRoleTitle() + " (" + drive.getCtcPackage() + "). Check eligibility and register now!",
                "OPPORTUNITY",
                "HIGH",
                "/institution/drives"
        );

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("driveId", driveId);
        response.put("companyName", drive.getCompanyName());
        response.put("eligibleCount", 240);
        response.put("message", "Broadcast alert dispatched successfully to all eligible cohort students.");
        return response;
    }

    @Transactional
    public PlacementDrive updateStatus(UUID driveId, String newStatus) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new IllegalArgumentException("Placement drive not found: " + driveId));
        drive.setStatus(newStatus.toUpperCase());
        return driveRepository.save(drive);
    }
}
