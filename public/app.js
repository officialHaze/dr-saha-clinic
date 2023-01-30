gsap.registerPlugin(ScrollTrigger);

const navBar = $(".nav-bar");
const navForm = $(".nav-bar > form");
const navList = $(".nav-bar > form > ul");
const introSec = $("#intro");
const logo = $(".logo");
const logoHeader1 = $(".logo > h1:nth-child(1)");
const logoImg = $(".logo-img");
const navItem = $(".nav-items");
const sideBarMenu = $(".sidebar-menu");
const sidebarForm = $(".nav-form-sidebar");
const sidebarClose = $(".close-mark");

const navItemss = document.querySelectorAll(".nav-items");

$(function () {
	$('[data-bs-toggle="popover"]').popover();
});

const tl2 = gsap.timeline({
	scrollTrigger: {
		trigger: "body",
		start: "0",
		end: "13%",
		scrub: 2,
	},
});

const tl3 = gsap.timeline({
	scrollTrigger: {
		trigger: "body",
		start: "0",
		end: "13%",
		scrub: 2,
	},
});

const tl4 = gsap.timeline({
	scrollTrigger: {
		trigger: introSec,
		start: "90%",
		end: "100%",
		scrub: 1,
	},
});

const tl5 = gsap.timeline({
	scrollTrigger: {
		trigger: "body",
		start: "0",
		end: "13%",
		scrub: 2,
	},
});

const tl6 = gsap.timeline({
	scrollTrigger: {
		trigger: "body",
		start: "0",
		end: "13%",
		scrub: 2,
	},
});

const tl9 = gsap.timeline({
	scrollTrigger: {
		trigger: introSec,
		start: "70%",
		end: "100%",
		scrub: 2,
	},
});

const tl10 = gsap.timeline({
	scrollTrigger: {
		trigger: "body",
		start: "0",
		end: "7%",
		scrub: 2,
	},
});

const tl11 = gsap.timeline({
	scrollTrigger: {
		trigger: "body",
		start: "0",
		end: "7%",
		scrub: 2,
	},
});

const tl12 = gsap.timeline({
	scrollTrigger: {
		trigger: navBar,
		start: "0",
		end: "100%",
		scrub: 2,
	},
});

const tl13 = gsap.timeline({
	scrollTrigger: {
		trigger: navBar,
		start: "0",
		end: "100%",
		scrub: 2,
	},
});

tl3.fromTo(logo, { scale: 2 }, { scale: 0.45, top: "-0.1rem", left: "-5rem" });

tl4.fromTo(
	logoHeader1,
	{
		fontWeight: "normal",
	},
	{
		fontWeight: "bold",
	}
);

tl5.fromTo(
	logoImg,
	{
		opacity: "0",
	},
	{
		opacity: "1",
	}
);

tl13.to(navBar, { boxShadow: "7px 0 20px rgba(0.4, 0.4, 0.4, 0.3)" });

dropMenu();
navAnimation();

function navAnimation() {
	const windowWidth = window.outerWidth;

	if (windowWidth >= 1920) {
		tl2.to(navForm, {
			transform: "translateX(17%)",
		});

		tl6.fromTo(
			navList,
			{ gap: "1.5rem" },
			{
				gap: "0.5rem",
			}
		);
	}
}

function dropMenu() {
	navItemss.forEach((item) => {
		showDropDown(item);
		hideDropDown(item);
	});
}

const tl = gsap.timeline({
	scrollTrigger: {
		trigger: navBar,
		start: "0",
		end: "7000vh",
		scrub: 1,
		pin: true,
		pinSpacing: false,
	},
});

function showDropDown(item) {
	item.addEventListener("mouseenter", (e) => {
		const parent = e.target;

		const child = parent.children[1];
		if (child.classList.contains("dropDown")) {
			child.style.display = "block";
		}
	});
}

function hideDropDown(item) {
	item.addEventListener("mouseleave", (e) => {
		const parent = e.target;
		const child = parent.children[1];
		if (child.classList.contains("dropDown")) {
			child.style.display = "none";
		}
	});
}

// ANIMATING THE NAVBAR DIFFERENTLY FOR LAPTOP VIEWERS
newNavAnimation();

function newNavAnimation() {
	const windowWidth = window.outerWidth;
	if (windowWidth <= 1550) {
		tl2.to(navForm, {
			y: "-20rem",
		});

		const tl8 = gsap.timeline({
			scrollTrigger: {
				trigger: sidebarForm,
				start: 0,
				end: "7000vh",
				scrub: 1,
				pin: true,
				pinSpacing: false,
			},
		});

		tl9.to(sideBarMenu, { scale: 1.25 });
		tl10.to(sidebarForm, { x: "-15rem", boxShadow: "0" });
		tl11.to(navBar, { y: "0" });
	}
}

sideBarMenu.click(async () => {
	return new Promise((resolve) => {
		navBar.css({
			transition: "transform 0.5s",
			transform: "translateY(-10rem)",
		});
		resolve();
	}).then(() => {
		sidebarForm.css({
			transition: "transform 0.5s",
			transform: "translateX(0)",
			boxShadow: "7px 7px 20px rgba(0.4, 0.4, 0.4, 0.3)",
			zIndex: 17,
		});
	});
});

sidebarClose.click(async () => {
	return new Promise((resolve) => {
		navBar.css({
			transition: "transform 0.5s",
			transform: "translateY(0)",
		});
		resolve();
	}).then(() => {
		sidebarForm.css({
			transition: "transform 0.5s",
			transform: "translateX(-15rem)",
			boxShadow: "none",
			zIndex: 10,
		});
	});
});
