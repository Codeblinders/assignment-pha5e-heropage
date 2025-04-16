document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") {
        console.error("GSAP is not loaded. Please include the GSAP library.");
        return;
    }

    console.log("DOM loaded, running animation script");

    // Check for required elements
    const heroSection = document.querySelector(".hero");
    const heroParagraphs = document.querySelectorAll(".hero h1 p");
    const heroImages = document.querySelectorAll(".hero-image");
    console.log(`Found ${heroParagraphs.length} .hero h1 p elements`);
    console.log(`Found ${heroImages.length} .hero-image elements`);
    if (!heroSection || heroParagraphs.length === 0 || heroImages.length === 0) {
        console.warn("Required elements (.hero, .hero h1 p, or .hero-image) not found in the DOM.");
    }

   

    if (!sessionStorage.getItem("animationPlayed")) {
        console.log("Playing animations for the first time");
        document.body.classList.add("animation-active");

        // Animate the <p> elements inside .hero h1
        gsap.from(heroParagraphs, {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 2.2,
            ease: "power3.out",
            onStart: () => console.log("Animating .hero h1 p elements"),
            onComplete: () => {
                console.log("Hero text animation complete");
                sessionStorage.setItem("animationPlayed", "true");
                document.body.classList.remove("animation-active");
            }
        });

        // Animate the .hero-image elements
        gsap.from(heroImages, {
            opacity: 0,
            scale: 0.5,
            stagger: 0.3,
            duration: 0.5,
            ease: "power3.out",
            onStart: () => console.log("Animating .hero-image elements")
        });
    } else {
        console.log("Animations skipped (already played in this session)");
        document.body.classList.remove("animation-active");
    }

    // Image hover animation logic
    const images = document.querySelectorAll(".hero-image");
    const heroText = document.querySelector(".hero h1");

    const imageData = [
        { title: "SAITAMA", subtitle: "ONE PUNCH MAN (STRONGEST IN THE VERSE)" },
        { title: "YAMAMOTO", subtitle: "CAPTAIN OF GOTEI 13" },
        { title: "SAITAMA", subtitle: "NORMAL MODE" },
        { title: "FINAL GETSUGA TENSHO", subtitle: "STRONGEST FORM OF BANKAI" }
    ];

    function positionHeading(heading, img) {
        const rect = img.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        heading.style.left = `${rect.left + scrollX + rect.width / 2 - heading.offsetWidth / 2}px`;
        heading.style.top = `${rect.bottom + scrollY - 25}px`;
    }

    images.forEach((img, index) => {
        const { title, subtitle } = imageData[index] || {};
        img.dataset.original = img.src;

        const heading = document.createElement("div");
        heading.className = "image-heading";
        heading.style.position = "absolute";
        heading.style.opacity = "0";
        heading.innerHTML = `
            <h2 style="font-family: 'Archivo Black', sans-serif; font-size: 2.5rem; margin: 0;">${title || "Title"}</h2>
            <p style="font-family: Arial, sans-serif; font-size: 1rem; margin: 5px 0 0;">${subtitle || "Subtext"}</p>
        `;
        img.parentElement.appendChild(heading);

        setTimeout(() => positionHeading(heading, img), 100);
        window.addEventListener("resize", () => positionHeading(heading, img));
        window.addEventListener("scroll", () => positionHeading(heading, img));

        img.addEventListener("mouseenter", () => {
            images.forEach(other => {
                if (other !== img) {
                    other.dataset.original && (other.src = "./images/svg.png");
                    gsap.to(other, { opacity: 0.3, filter: "grayscale(1)", duration: 0.3 });
                }
            });
            gsap.to(img, { scale: 1.1, zIndex: 10, duration: 0.4, ease: "power2.out" });
            gsap.to(heroText, { color: "transparent", zIndex: 0, duration: 0.2 });
            heroText.style.webkitTextStroke = "0.3px white";
            gsap.to(heading, { opacity: 1, y: 0, duration: 0.3 });
        });

        img.addEventListener("mousemove", e => {
            const rect = img.getBoundingClientRect();
            const offsetX = e.clientX - (rect.left + rect.width / 2);
            const offsetY = e.clientY - (rect.top + rect.height / 2);
            const moveX = Math.max(Math.min(offsetX * 0.7, 100), -100);
            const moveY = Math.max(Math.min(offsetY * 0.7, 100), -100);
            gsap.to(img, { x: moveX, y: moveY, duration: 0.3, ease: "power2.out" });
        });

        img.addEventListener("mouseleave", () => {
            images.forEach(other => {
                if (other.dataset.original) {
                    other.src = other.dataset.original;
                }
                gsap.to(other, { opacity: 1, filter: "grayscale(0)", pointerEvents: "auto", duration: 0.2 });
            });
            gsap.to(img, { x: 0, y: 0, scale: 1, zIndex: 1, duration: 0.4, ease: "power2.out" });
            gsap.to(heroText, { color: "white", zIndex: 3, duration: 0.2 });
            heroText.style.webkitTextStroke = "0px white";
            gsap.to(heading, { opacity: 0, y: 10, duration: 0.3 });
        });
    });
});
