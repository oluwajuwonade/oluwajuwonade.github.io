document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-print-target]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-print-target");
      if (!target) return;
      document.body.setAttribute("data-print-target", target);
      window.print();
    });
  });
  window.addEventListener("afterprint", () => {
    document.body.removeAttribute("data-print-target");
  });
});
