/**
 * Date utility functions for form calculations
 */

/**
 * Calculate age from date of birth
 * @param dobString - ISO date string (YYYY-MM-DD) or Date object
 * @returns age in years, null if invalid date
 */
export function calculateAge(dobString: string | Date | null | undefined): number | null {
  if (!dobString) return null;
  
  try {
    const dob = typeof dobString === 'string' ? new Date(dobString) : dobString;
    if (isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    // Validate reasonable age
    if (age < 0 || age > 120) return null;
    return age;
  } catch {
    return null;
  }
}

/**
 * Calculate riding experience from licence issue date
 * @param licenceIssueDateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns years of experience as decimal (e.g., 2.5), null if invalid
 */
export function calculateRidingExperience(licenceIssueDateString: string | Date | null | undefined): number | null {
  if (!licenceIssueDateString) return null;

  try {
    const issueDate = typeof licenceIssueDateString === 'string' ? new Date(licenceIssueDateString) : licenceIssueDateString;
    if (isNaN(issueDate.getTime())) return null;

    const today = new Date();
    const diffMs = today.getTime() - issueDate.getTime();
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    
    // Return 0 if date is in future, or not more than 0 years
    if (diffYears < 0) return 0;
    
    // Round to 1 decimal place
    return Math.round(diffYears * 10) / 10;
  } catch {
    return null;
  }
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return '';
  try {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

/**
 * Parse date string (YYYY-MM-DD) to Date object
 */
export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString + 'T00:00:00');
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}
