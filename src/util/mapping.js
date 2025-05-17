const STUDENT = 1;
const TUTOR = 2;
const ENTERPRISE = 3;
const FINANCE = 4;
const ADMIN = 5;
const SUPPORT = 6;

const userRoleIdToName = {
  1: "STUDENT",
  2: "TUTOR",
  3: "ENTERPRISE",
  4: "FINANCE",
  5: "ADMIN",
  6: "SUPPORT",
};

const userRoleIdToPage = {
  1: "/schueler",
  2: "/tutor",
  3: "/enterprise",
  4: "/finance",
  5: "/admin",
  6: "/support",
};

export { userRoleIdToName, userRoleIdToPage, STUDENT, TUTOR, ENTERPRISE, FINANCE, ADMIN, SUPPORT };
