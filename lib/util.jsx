export const getByApprovalStatus = (value) => {
    if (value == "current") {
      return {
        active: true,
        blocked: false,
        reject: false,
      };
    } else if (value == "requested") {
      return {
        active: false,
        blocked: false,
        reject: false,
      };
    } else if (value == "blocked") {
      return {
        blocked: true,
      };
    } else if (value == "rejected") {
      return {
        reject: true,
      };
    }
  };