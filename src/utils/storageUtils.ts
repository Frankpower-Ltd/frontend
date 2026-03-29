export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
}

export interface Application {
  id: string;
  userId: string;
  programType: string;
  program: string;
  programName: string;
  price: number;
  learningMode: string;
  personalDetails: PersonalDetails;
  status: "pending" | "completed" | "failed";
  paymentStatus: "unpaid" | "paid";
  paymentReference?: string;
  dateSubmitted: string;
  dateCompleted?: string;
}

const STORAGE_KEY_PREFIX = "frankpower_applications_";
const DRAFT_KEY_PREFIX = "draft_application_";

export const saveApplication = (
  userId: string,
  application: Application,
): void => {
  const applications = getApplications(userId);
  const existingIndex = applications.findIndex(
    (app) => app.id === application.id,
  );

  if (existingIndex >= 0) {
    applications[existingIndex] = application;
  } else {
    applications.push(application);
  }

  localStorage.setItem(
    `${STORAGE_KEY_PREFIX}${userId}`,
    JSON.stringify(applications),
  );
};

export const getApplications = (userId: string): Application[] => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading applications from localStorage", error);
    return [];
  }
};

export const getApplicationById = (
  userId: string,
  appId: string,
): Application | null => {
  const applications = getApplications(userId);
  return applications.find((app) => app.id === appId) || null;
};

export const updateApplicationStatus = (
  userId: string,
  appId: string,
  status: Application["status"],
  paymentReference?: string,
): void => {
  const applications = getApplications(userId);
  const applicationIndex = applications.findIndex((app) => app.id === appId);

  if (applicationIndex >= 0) {
    applications[applicationIndex].status = status;
    if (status === "completed") {
      applications[applicationIndex].paymentStatus = "paid";
      applications[applicationIndex].dateCompleted = new Date().toISOString();
    }
    if (paymentReference) {
      applications[applicationIndex].paymentReference = paymentReference;
    }
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${userId}`,
      JSON.stringify(applications),
    );
  }
};

export const getDraftApplication = (
  userId: string,
): Partial<Application> | null => {
  try {
    const data = localStorage.getItem(`${DRAFT_KEY_PREFIX}${userId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading draft application from localStorage", error);
    return null;
  }
};

export const saveDraftApplication = (
  userId: string,
  draft: Partial<Application>,
): void => {
  try {
    localStorage.setItem(`${DRAFT_KEY_PREFIX}${userId}`, JSON.stringify(draft));
  } catch (error) {
    console.error("Error saving draft application to localStorage", error);
  }
};

export const clearDraftApplication = (userId: string): void => {
  localStorage.removeItem(`${DRAFT_KEY_PREFIX}${userId}`);
};
