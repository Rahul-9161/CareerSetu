package in.careersetu.apprenticeships.service;

import in.careersetu.apprenticeships.dto.ApprenticeshipDtos.*;
import in.careersetu.apprenticeships.entity.*;
import in.careersetu.apprenticeships.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class ApprenticeshipService {

    private final ApaarCreditRecordRepository apaarRepository;
    private final NatsApprenticeshipContractRepository contractRepository;
    private final DbtStipendDisbursementRepository disbursementRepository;

    public ApprenticeshipService(ApaarCreditRecordRepository apaarRepository,
                                 NatsApprenticeshipContractRepository contractRepository,
                                 DbtStipendDisbursementRepository disbursementRepository) {
        this.apaarRepository = apaarRepository;
        this.contractRepository = contractRepository;
        this.disbursementRepository = disbursementRepository;
    }

    @Transactional(readOnly = true)
    public ApaarStudentOverview getApaarOverview(UUID studentId) {
        ApaarCreditRecord rec = getOrCreateApaarRecord(studentId);
        return toOverviewDto(rec);
    }

    public ApaarStudentOverview syncApaarCredits(UUID studentId, Integer additionalCredits) {
        ApaarCreditRecord rec = getOrCreateApaarRecord(studentId);
        int toAdd = additionalCredits != null && additionalCredits > 0 ? additionalCredits : 4;
        rec.setCumulativeCreditsDeposited(rec.getCumulativeCreditsDeposited() + toAdd);
        rec.setDigilockerStatus("VERIFIED");
        rec.setDigilockerXmlHash(generateDigiLockerHash(rec));
        rec.setLastSyncedAt(Instant.now());
        apaarRepository.save(rec);
        return toOverviewDto(rec);
    }

    public ApaarStudentOverview linkApaar(LinkApaarRequest req) {
        UUID sId = req.studentId() != null ? UUID.fromString(req.studentId()) : UUID.randomUUID();
        ApaarCreditRecord rec = getOrCreateApaarRecord(sId);
        rec.setApaarId(req.apaarId());
        if (req.studentName() != null) rec.setStudentName(req.studentName());
        rec.setDigilockerStatus("VERIFIED");
        rec.setDigilockerXmlHash(generateDigiLockerHash(rec));
        rec.setLastSyncedAt(Instant.now());
        apaarRepository.save(rec);
        return toOverviewDto(rec);
    }

    private ApaarCreditRecord getOrCreateApaarRecord(UUID studentId) {
        if (studentId != null) {
            Optional<ApaarCreditRecord> opt = apaarRepository.findByStudentId(studentId);
            if (opt.isPresent()) return opt.get();
        }
        return apaarRepository.findAll().stream().findFirst().orElseGet(() -> {
            ApaarCreditRecord defaultRec = new ApaarCreditRecord(
                    null,
                    studentId != null ? studentId : UUID.randomUUID(),
                    "APAAR-9182-4412-8809",
                    "DL-ARV-99210",
                    "Aarav Sharma",
                    "National Institute of Technology Surathkal",
                    28,
                    "Computer Science & Engineering",
                    "VERIFIED",
                    "0x7b2a9d1f30e65c9284fa07b1d39e5684a2f1c8e79b03d528f149bca7e891"
            );
            return apaarRepository.save(defaultRec);
        });
    }

    private ApaarStudentOverview toOverviewDto(ApaarCreditRecord rec) {
        List<ApaarCreditCourseDto> courses = List.of(
                new ApaarCreditCourseDto(UUID.randomUUID().toString(), "CS-401", "Distributed Cloud Systems & Microservices", rec.getInstitutionName(), 4, "2025-26", "Semester VII", "A+", "DL-DOC-8819", "SYNCED", Instant.now().toString()),
                new ApaarCreditCourseDto(UUID.randomUUID().toString(), "CS-402", "Advanced Machine Learning & Deep Learning", rec.getInstitutionName(), 4, "2025-26", "Semester VII", "A", "DL-DOC-8820", "SYNCED", Instant.now().toString()),
                new ApaarCreditCourseDto(UUID.randomUUID().toString(), "CS-403", "Full Stack Cloud Application Architecture", rec.getInstitutionName(), 4, "2025-26", "Semester VII", "O", "DL-DOC-8821", "SYNCED", Instant.now().toString()),
                new ApaarCreditCourseDto(UUID.randomUUID().toString(), "IN-491", "NATS 2.0 Industry Apprenticeship Practicum", "TechCorp India Technologies", 8, "2025-26", "Semester VIII", "A+", "DL-DOC-8822", "SYNCED", Instant.now().toString()),
                new ApaarCreditCourseDto(UUID.randomUUID().toString(), "CS-305", "Database Internals & Distributed Storage", rec.getInstitutionName(), 8, "2024-25", "Semester VI", "A", "DL-DOC-8823", "SYNCED", Instant.now().toString())
        );
        return new ApaarStudentOverview(
                rec.getStudentId().toString(),
                rec.getStudentName(),
                rec.getApaarId(),
                "VERIFIED".equalsIgnoreCase(rec.getDigilockerStatus()),
                rec.getCumulativeCreditsDeposited(),
                160,
                courses
        );
    }

    @Transactional(readOnly = true)
    public List<NatsContractResponse> getStudentContracts(UUID studentId) {
        List<NatsApprenticeshipContract> list = new ArrayList<>();
        if (studentId != null) {
            list = contractRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        }
        if (list.isEmpty()) {
            list = contractRepository.findAll();
        }
        return list.stream().map(this::toContractResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<NatsContractResponse> getEmployerContracts(UUID employerId) {
        List<NatsApprenticeshipContract> list = contractRepository.findAll();
        return list.stream().map(this::toContractResponse).toList();
    }

    @Transactional(readOnly = true)
    public NatsContractResponse getContractResponseById(UUID id) {
        NatsApprenticeshipContract c = contractRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("NATS Contract not found with id: " + id));
        return toContractResponse(c);
    }

    public NatsContractResponse createContract(CreateNatsContractRequest req) {
        NatsApprenticeshipContract c = new NatsApprenticeshipContract();
        c.setContractNumber("NATS-2026-KA-" + (new Random().nextInt(90000) + 10000));
        c.setStudentId(req.studentId() != null ? UUID.fromString(req.studentId()) : UUID.randomUUID());
        c.setStudentName(req.studentName() != null ? req.studentName() : "Aarav Sharma");
        c.setStudentApaarId("APAAR-9182-4412-8809");
        c.setCompanyId(req.employerId() != null ? UUID.fromString(req.employerId()) : UUID.randomUUID());
        c.setCompanyName(req.employerName() != null ? req.employerName() : "TechCorp India Technologies");
        c.setTradeDiscipline(req.tradeDiscipline() != null ? req.tradeDiscipline() : "Cloud & DevOps Engineering");
        c.setDurationMonths(req.durationMonths() != null ? req.durationMonths() : 12);

        int total = req.stipendTotalMonthly() != null ? req.stipendTotalMonthly() : 20000;
        int dbt = req.govSubsidyDbtShare() != null ? req.govSubsidyDbtShare() : Math.min(4500, (int) Math.round(total * 0.25));
        int employerShare = total - dbt;

        c.setTotalMonthlyStipend(total);
        c.setGovernmentDbtShareStipend(dbt);
        c.setCorporateShareStipend(employerShare);
        c.setBoatRegionalCouncil(req.boatRegion() != null ? req.boatRegion() : "BOAT_WESTERN_REGION");
        c.setStatus("APPROVED_BY_BOAT");
        c.setStartDate(req.startDate() != null ? req.startDate() : LocalDate.of(2026, 1, 1));
        c.setEndDate(req.endDate() != null ? req.endDate() : LocalDate.of(2026, 12, 31));

        c = contractRepository.save(c);
        return toContractResponse(c);
    }

    public NatsContractResponse signContract(UUID contractId, SignContractRequest req) {
        NatsApprenticeshipContract c = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found with id: " + contractId));
        c.setStatus("APPROVED_BY_BOAT");
        contractRepository.save(c);
        return toContractResponse(c);
    }

    private NatsContractResponse toContractResponse(NatsApprenticeshipContract c) {
        return new NatsContractResponse(
                c.getId().toString(),
                c.getContractNumber(),
                c.getStudentId().toString(),
                c.getStudentName(),
                "aarav.sharma@careersetu.in",
                "inst-nit-surathkal",
                "National Institute of Technology Surathkal",
                c.getCompanyId() != null ? c.getCompanyId().toString() : "comp-techcorp",
                c.getCompanyName(),
                c.getTradeDiscipline(),
                "GRADUATE_APPRENTICE",
                c.getTotalMonthlyStipend(),
                c.getGovernmentDbtShareStipend(),
                c.getCorporateShareStipend(),
                c.getStartDate(),
                c.getEndDate(),
                c.getDurationMonths(),
                c.getBoatRegionalCouncil(),
                c.getStatus(),
                Instant.now().minusSeconds(86400 * 30),
                Instant.now().minusSeconds(86400 * 28),
                Instant.now().minusSeconds(86400 * 25),
                Instant.now().minusSeconds(86400 * 20),
                "PFMS-BEN-8841",
                "XXXX-XXXX-4921",
                "SBIN0001234",
                c.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<DbtDisbursementResponse> getContractDisbursements(UUID contractId) {
        NatsApprenticeshipContract c = contractRepository.findById(contractId).orElse(null);
        List<DbtStipendDisbursement> list = disbursementRepository.findByContractIdOrderByCreatedAtDesc(contractId);
        return list.stream().map(d -> toDisbursementResponse(d, c)).toList();
    }

    @Transactional(readOnly = true)
    public List<DbtDisbursementResponse> getStudentDisbursements(UUID studentId) {
        List<NatsApprenticeshipContract> contracts = contractRepository.findAll();
        List<DbtDisbursementResponse> result = new ArrayList<>();
        for (NatsApprenticeshipContract c : contracts) {
            List<DbtStipendDisbursement> vouchers = disbursementRepository.findByContractIdOrderByCreatedAtDesc(c.getId());
            for (DbtStipendDisbursement v : vouchers) {
                result.add(toDisbursementResponse(v, c));
            }
        }
        return result;
    }

    public DbtDisbursementResponse generateDbtClaim(GenerateDbtClaimRequest req) {
        UUID cId = UUID.fromString(req.contractId());
        NatsApprenticeshipContract c = contractRepository.findById(cId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found with id: " + cId));

        int empPaid = req.employerPaidAmount() != null ? req.employerPaidAmount() : c.getCorporateShareStipend();
        int dbtShare = c.getGovernmentDbtShareStipend();

        DbtStipendDisbursement voucher = new DbtStipendDisbursement();
        voucher.setContractId(cId);
        voucher.setVoucherMonth(req.monthYear());
        voucher.setCorporateStipendAmount(empPaid);
        voucher.setGovernmentDbtAmount(dbtShare);
        voucher.setEmployerNeftReference("NEFT-TECHCORP-" + (new Random().nextInt(900000) + 100000));
        voucher.setDbtApbsReference("CPSMS-" + (new Random().nextInt(9000000) + 1000000));
        voucher.setStatus("CLAIM_SUBMITTED");
        voucher.setRemarks("Attendance certified (" + (req.daysAttended() != null ? req.daysAttended() : 26) + " days). Submitted for PFMS 25% DBT disbursement.");
        voucher = disbursementRepository.save(voucher);

        return toDisbursementResponse(voucher, c);
    }

    public DbtDisbursementResponse disburseDbtVoucher(UUID voucherId) {
        DbtStipendDisbursement voucher = disbursementRepository.findById(voucherId)
                .orElseThrow(() -> new IllegalArgumentException("Voucher not found with id: " + voucherId));
        voucher.setStatus("DISBURSED_TO_ACCOUNT");
        voucher.setDbtApbsReference("APBS-PFMS-" + String.format("%08d", new Random().nextInt(90000000) + 10000000));
        voucher.setDisbursedAt(Instant.now());
        voucher.setRemarks("Direct Benefit Transfer successfully credited to apprentice Aadhaar Payment Bridge account.");
        voucher = disbursementRepository.save(voucher);

        NatsApprenticeshipContract c = contractRepository.findById(voucher.getContractId()).orElse(null);
        return toDisbursementResponse(voucher, c);
    }

    private DbtDisbursementResponse toDisbursementResponse(DbtStipendDisbursement d, NatsApprenticeshipContract c) {
        String cNum = c != null ? c.getContractNumber() : "NATS-2026-KA-44128";
        String sId = c != null ? c.getStudentId().toString() : UUID.randomUUID().toString();
        String sName = c != null ? c.getStudentName() : "Aarav Sharma";
        String empId = c != null && c.getCompanyId() != null ? c.getCompanyId().toString() : "comp-techcorp";
        String empName = c != null ? c.getCompanyName() : "TechCorp India Technologies";

        int total = d.getCorporateStipendAmount() + d.getGovernmentDbtAmount();
        String status = "DBT_CREDITED".equalsIgnoreCase(d.getStatus()) ? "DISBURSED_TO_ACCOUNT" : d.getStatus();

        return new DbtDisbursementResponse(
                d.getId().toString(),
                d.getContractId().toString(),
                cNum,
                sId,
                sName,
                empId,
                empName,
                d.getVoucherMonth(),
                total,
                d.getGovernmentDbtAmount(),
                d.getCorporateStipendAmount(),
                26,
                d.getEmployerNeftReference(),
                d.getDbtApbsReference(),
                status,
                LocalDate.now(),
                d.getDisbursedAt(),
                d.getRemarks()
        );
    }

    @Transactional(readOnly = true)
    public ApprenticeshipStatsResponse getStats() {
        long activeContracts = contractRepository.count();
        long apaarCount = apaarRepository.count();
        long totalCredits = apaarRepository.findAll().stream()
                .mapToLong(ApaarCreditRecord::getCumulativeCreditsDeposited)
                .sum();
        long dbtDisbursed = disbursementRepository.findAll().stream()
                .mapToLong(DbtStipendDisbursement::getGovernmentDbtAmount)
                .sum();

        return new ApprenticeshipStatsResponse(activeContracts, apaarCount, dbtDisbursed, totalCredits);
    }

    private String generateDigiLockerHash(ApaarCreditRecord rec) {
        try {
            String raw = rec.getApaarId() + ":" + rec.getDigilockerId() + ":" + rec.getCumulativeCreditsDeposited() + ":" + System.currentTimeMillis();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return "0x" + HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return "0x" + UUID.randomUUID().toString().replace("-", "") + "digilocker";
        }
    }
}
