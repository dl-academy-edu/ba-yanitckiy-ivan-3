const checkEmail = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u

const body = document.querySelector("body")
const headerLinks = document.querySelectorAll(".header__item")
const activeLink = document.querySelector(".header__item_active")

const menuWrapper = document.querySelector(".menu-wrapper")
const menuButton = document.querySelector(".main-portfolio__button")
const menuClose = document.querySelector(".menu-wrapper__close")

const registerSubmit = document.querySelector(".register__submit")
const registerLabel = document.querySelector(".register__check-label")
const sendMessageSubmit = document.querySelector(".send-message__submit")
const sendMessageLabel = document.querySelector(".send-message__check-label")

const register = document.querySelectorAll(".register-button")
const registerClose = document.querySelector(".register__close-button")
const signIn = document.querySelectorAll(".sign-in-button")
const signInClose = document.querySelector(".sign-in__close-button")
const sendMessage = document.querySelector(".footer__button")
const sendMessageClose = document.querySelector(".send-message__close-button")

const formSections = document.querySelectorAll(".form")
const forms = document.querySelectorAll(".form__main")

// console.log(forms)

const signInSection = document.querySelector(".sign-in")
const registerSection = document.querySelector(".register")
const sendMessageSection = document.querySelector(".send-message")

// const signInForm = signInSection.children[0]
// const registerForm = registerSection.children[0]
// const sendMessageForm = sendMessageSection.children[0]

const wrapper = document.querySelector(".slider__wrapper")
const innerWrapper = document.querySelector(".slider__inner-wrapper")
const slides = document.querySelectorAll(".slider__slide")
const pagination = document.querySelector(".slider__pagination")

const buttonPrev = document.querySelector(".slider__prev")
const buttonNext = document.querySelector(".slider__next")

const amount = innerWrapper.children.length
let width = +getComputedStyle(wrapper).width.split("px")[0]
let activePos = 0

const swiper = new Swiper('.swiper', {
	direction: 'horizontal',
	loop: false,
	allowTouchMove: false,

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

function changeWidth() {
	for (let slide of slides) {
		slide.style.width = `${width}px`
	}
}

const changeSlide = (direction) => {
	const activeDot = document.querySelector(".slider__dot_active")
	switch (direction) {
		case "next":
			activePos++
			if (activePos == amount - 1) {
				buttonNext.setAttribute("disabled", true)
			}
			if (activePos > 0) {
				buttonPrev.removeAttribute("disabled")
			}
			innerWrapper.style.marginLeft = `-${activePos * width}px`

			activeDot.classList.remove("slider__dot_active")
			pagination.children[activePos].classList.add("slider__dot_active")
			break

		case "prev":
			if (activePos == 1) {
				buttonPrev.setAttribute("disabled", true)
			}
			activePos--
			if (activePos < amount - 1) {
				buttonNext.removeAttribute("disabled")
			}
			innerWrapper.style.marginLeft = `-${activePos * width}px`

			activeDot.classList.remove("slider__dot_active")
			pagination.children[activePos].classList.add("slider__dot_active")
			break
	}
}

for (let i = 0; i < amount; i++) {
	const dot = document.createElement("button")
	dot.classList.add("slider__dot")

	if (i == activePos) {
		dot.classList.add("slider__dot_active")
	}

	dot.addEventListener("click", () => {
		innerWrapper.style.marginLeft = `-${i * width}px`

		const activeDot = document.querySelector(".slider__dot_active")
		activeDot.classList.remove("slider__dot_active")
		dot.classList.add("slider__dot_active")
		activePos = i

		if (activePos == amount - 1) {
			buttonNext.setAttribute("disabled", true)
		}
		if (activePos == 0) {
			buttonPrev.setAttribute("disabled", true)
		}
		if (activePos > 0) {
			buttonPrev.removeAttribute("disabled")
		}
		if (activePos < amount - 1) {
			buttonNext.removeAttribute("disabled")
		}
	})

	pagination.insertAdjacentElement("beforeend", dot)
}

if (activePos == 0) {
	buttonPrev.setAttribute("disabled", true)
}

if (activePos == amount - 1) {
	buttonNext.setAttribute("disabled", true)
}

changeWidth()

for (let link of headerLinks) {
	if (link != activeLink) {
		link.addEventListener("mouseenter", () => {
			activeLink.style.color = "#828282"
		})
		link.addEventListener("mouseleave", () => {
			activeLink.style.color = "#070707"
		})
	}
}

buttonNext.addEventListener("click", () => {
	changeSlide("next")
})

buttonPrev.addEventListener("click", () => {
	changeSlide("prev")
})

window.addEventListener("resize", () => {
	width = +getComputedStyle(wrapper).width.split("px")[0]
	changeWidth()
})

menuButton.addEventListener("click", () => {
	menuWrapper.classList.remove("menu-wrapper_close")
	body.style.overflow = "hidden"
})

menuClose.addEventListener("click", () => {
	menuWrapper.classList.add("menu-wrapper_close")
	body.style.overflow = "auto"
})



for (let button of signIn) {
	button.addEventListener("click", () => {
		signInSection.classList.remove("form_close")
		body.style.overflow = "hidden"
	})
}

signInClose.addEventListener("click", () => {
	signInSection.classList.add("form_close")
	body.style.overflow = "auto"
})

for (let button of register) {
	button.addEventListener("click", () => {
		registerSection.classList.remove("form_close")
		body.style.overflow = "hidden"
	})
}

registerClose.addEventListener("click", () => {
	registerSection.classList.add("form_close")
	body.style.overflow = "auto"
})

sendMessage.addEventListener("click", () => {
	sendMessageSection.classList.remove("form_close")
	body.style.overflow = "hidden"
})

sendMessageClose.addEventListener("click", () => {
	sendMessageSection.classList.add("form_close")
	body.style.overflow = "auto"
})



registerLabel.addEventListener("click", () => {
	if (registerSubmit.hasAttribute("disabled")) {
		registerSubmit.removeAttribute("disabled")
		registerSubmit.classList.remove("form__submit_dis")
		registerSubmit.classList.add("form__submit_active")
	} else {
		registerSubmit.setAttribute("disabled", true)
		registerSubmit.classList.add("form__submit_dis")
		registerSubmit.classList.remove("form__submit_active")
	}
})

sendMessageLabel.addEventListener("click", () => {
	if (sendMessageSubmit.hasAttribute("disabled")) {
		sendMessageSubmit.removeAttribute("disabled")
		sendMessageSubmit.classList.remove("form__submit_dis")
		sendMessageSubmit.classList.add("form__submit_active")
	} else {
		sendMessageSubmit.setAttribute("disabled", true)
		sendMessageSubmit.classList.add("form__submit_dis")
		sendMessageSubmit.classList.remove("form__submit_active")
	}
})

for (let form of forms) {
	form.addEventListener("submit", (e) => {
		e.preventDefault()

		for (let item of form.querySelectorAll(".form__item")) {
			const input = item.querySelector(".form__input")
			if (input.classList.contains("form__input_required") && input.value == "" && !item.querySelector(".form__error") && input.name != "email") {
				let error = document.createElement("div")
				error.classList.add("form__error")
				error.innerText = "This field is required"
				item.insertAdjacentElement("beforeend", error)

				input.classList.add("form__input_empty")
			} else if (!checkEmail.test(input.value) && input.name == "email" && !item.querySelector(".form__error")) {
				let error = document.createElement("div")
				error.classList.add("form__error")
				error.innerText = "Please enter a valid email address (your entry is not in the format \"somebody@example.com\")"
				item.insertAdjacentElement("beforeend", error)

				input.classList.add("form__input_empty")
			} else if ((item.querySelector(".form__error") && input.value != "" && input.name != "email") || ((item.querySelector(".form__error") && checkEmail.test(input.value)))) {
				item.querySelector(".form__error").remove()
				input.classList.remove("form__input_empty")
			}
		}
	})
}