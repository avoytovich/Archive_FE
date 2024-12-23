interface Router {
  push: (url: string) => void;
}

export const handleNavigate = (router: Router, selectedGroup: string) => {
  if (!selectedGroup) {
    alert("Please select a group first.");
    return;
  }
  router.push(`/documents?group=${selectedGroup}`);
};
