import { ref, onMounted, onUnmounted } from "vue";

export function useScrollNavigation(totalPages) {
  const currentPage = ref(0);
  const isScrolling = ref(false);

  let touchStartY = 0;
  let wheelAccumulate = 0;
  const WHEEL_THRESHOLD = 120;

  const scrollToPage = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    isScrolling.value = true;
    currentPage.value = pageIndex;
    const targetPage = document.getElementById(`page-${pageIndex}`);
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      isScrolling.value = false;
    }, 800);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (isScrolling.value) {
      wheelAccumulate = 0;
      return;
    }
    wheelAccumulate += e.deltaY;
    if (wheelAccumulate > WHEEL_THRESHOLD && currentPage.value < totalPages - 1) {
      wheelAccumulate = 0;
      scrollToPage(currentPage.value + 1);
    } else if (wheelAccumulate < -WHEEL_THRESHOLD && currentPage.value > 0) {
      wheelAccumulate = 0;
      scrollToPage(currentPage.value - 1);
    }
    clearTimeout(window.wheelTimer);
    window.wheelTimer = setTimeout(() => {
      wheelAccumulate = 0;
    }, 300);
  };

  const handleKeydown = (e) => {
    if (isScrolling.value) return;
    if ((e.key === "ArrowDown" || e.key === "PageDown") && currentPage.value < totalPages - 1) {
      e.preventDefault();
      scrollToPage(currentPage.value + 1);
    } else if ((e.key === "ArrowUp" || e.key === "PageUp") && currentPage.value > 0) {
      e.preventDefault();
      scrollToPage(currentPage.value - 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isScrolling.value) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    const TOUCH_THRESHOLD = 80;
    if (delta > TOUCH_THRESHOLD && currentPage.value < totalPages - 1) {
      scrollToPage(currentPage.value + 1);
    } else if (delta < -TOUCH_THRESHOLD && currentPage.value > 0) {
      scrollToPage(currentPage.value - 1);
    }
  };

  onMounted(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchend", handleTouchEnd);
  });

  return { currentPage, isScrolling, scrollToPage };
}
