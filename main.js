function scrollToSlide(index) {
    const slideWidth = window.innerWidth;
    const wrapper = document.getElementById("slides");
    wrapper.style.transform = `translateX(-${index * slideWidth}px)`;
    setActiveMenu(index);
    sessionStorage.setItem("currentSlide", index);
}
  
window.onload = () => {
    const savedSlide = sessionStorage.getItem("currentSlide") || 0;
    scrollToSlide(savedSlide);
};

function setActiveMenu(index) {
    document.querySelectorAll("nav a").forEach((a, i) => {
      if (i === index) a.classList.add("active");
      else a.classList.remove("active");
    });
}