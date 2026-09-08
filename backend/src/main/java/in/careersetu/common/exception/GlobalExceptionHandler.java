package in.careersetu.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Global exception handler.
 *
 * <p>Never exposes stack traces, internal implementation details, or
 * sensitive information in API responses. All errors use a standard
 * structured format with request IDs for traceability.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(CareerSetuException.class)
    public ResponseEntity<ErrorResponse> handleCareerSetuException(
            CareerSetuException ex, HttpServletRequest request) {
        log.warn("Business exception: code={} message={}", ex.getCode(), ex.getMessage());
        return ResponseEntity
                .status(ex.getHttpStatus())
                .body(ErrorResponse.of(ex.getCode(), ex.getMessage(), ex.getDetails(), request));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> details = ex.getBindingResult().getAllErrors().stream()
                .map(error -> {
                    if (error instanceof FieldError fe) {
                        return fe.getField() + ": " + fe.getDefaultMessage();
                    }
                    return error.getDefaultMessage();
                })
                .toList();

        return ResponseEntity
                .badRequest()
                .body(ErrorResponse.of("VALIDATION_FAILED", "Request validation failed", details, request));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(
            AuthenticationException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of("AUTHENTICATION_FAILED", "Authentication required", List.of(), request));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ErrorResponse.of("ACCESS_DENIED", "You do not have permission to perform this action", List.of(), request));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {
        // Log full details internally, never expose to client
        log.error("Unhandled exception on {} {}: {}", request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of("INTERNAL_ERROR", "An unexpected error occurred. Please try again.", List.of(), request));
    }

    public record ErrorResponse(
            String code,
            String message,
            List<String> details,
            String requestId,
            String timestamp
    ) {
        public static ErrorResponse of(String code, String message, List<String> details,
                                        HttpServletRequest request) {
            String requestId = getOrGenerateRequestId(request);
            return new ErrorResponse(code, message, details, requestId, Instant.now().toString());
        }

        private static String getOrGenerateRequestId(HttpServletRequest request) {
            String existing = request.getHeader("X-Request-ID");
            return (existing != null && !existing.isBlank()) ? existing : UUID.randomUUID().toString();
        }
    }
}
