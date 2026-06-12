document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const counters = document.querySelectorAll(".count-up");
    const revealItems = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-up, .reveal-scale");

    const updateNavbar = () => {
        if (!navbar) {
            return;
        }

        if (window.scrollY > 60) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

    const formatValue = (value, shouldUseCommas) => {
        if (!shouldUseCommas) {
            return String(value);
        }

        return new Intl.NumberFormat("en-US").format(value);
    };

    const animateCounter = (counter) => {
        if (counter.dataset.animated === "true") {
            return;
        }

        counter.dataset.animated = "true";

        const target = Number(counter.dataset.count || 0);
        const suffix = counter.dataset.suffix || "";
        const useCommas = counter.dataset.format === "comma";
        const duration = 1500;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const currentValue = Math.round(target * easedProgress);

            counter.textContent = `${formatValue(currentValue, useCommas)}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = `${formatValue(target, useCommas)}${suffix}`;
            }
        };

        requestAnimationFrame(tick);
    };

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.35
    });

    counters.forEach((counter) => {
        counterObserver.observe(counter);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
    });

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
});
