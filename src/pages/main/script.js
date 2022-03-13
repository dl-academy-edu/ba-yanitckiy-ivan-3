const checkEmail = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u

const baseURL = "https://academy.directlinedev.com/api"

const body = document.querySelector("body")
const headerLinks = document.querySelectorAll(".header__item")
const activeLink = document.querySelector(".header__item_active")

const menuWrapper = document.querySelector(".menu-wrapper")
const menuButton = document.querySelector(".open-menu-wrapper")
const menuClose = document.querySelector(".menu-wrapper__close")

const register = document.querySelectorAll(".register-button")
const signIn = document.querySelectorAll(".sign-in-button")
const sendMessage = document.querySelector(".footer__button")

const formSections = document.querySelectorAll(".form")

const signInSection = document.querySelector(".sign-in")
const registerSection = document.querySelector(".register")
const sendMessageSection = document.querySelector(".send-message")

const wrapper = document.querySelector(".slider__wrapper")
const innerWrapper = document.querySelector(".slider__inner-wrapper")
const slides = document.querySelectorAll(".slider__slide")
const pagination = document.querySelector(".slider__pagination")

const sliderSwiper = document.querySelectorAll(".portfolio__slide img")

const buttonPrev = document.querySelector(".slider__prev")
const buttonNext = document.querySelector(".slider__next")

const amount = innerWrapper.children.length
let width = +getComputedStyle(wrapper).width.split("px")[0]
let activePos = 0

const changeHeaderMenu = () => {
	const headerButtons = document.querySelectorAll(".header button")
	const menuButtons = document.querySelectorAll(".menu-wrapper button")
	const profileLink = document.querySelector(".profile-link")
	const menuLink = document.querySelector(".menu-link")

	if (localStorage.getItem("token") && localStorage.getItem("userId")) {
		for (let button of headerButtons) {
			button.classList.add("header__item_hide")
		}
		for (let button of menuButtons) {
			button.classList.add("menu-wrapper__link_hide")
		}
		profileLink.classList.remove("header__item_hide")
		menuLink.classList.remove("menu-wrapper__link_hide")
	} else {
		for (let button of headerButtons) {
			button.classList.remove("header__item_hide")
		}
		for (let button of menuButtons) {
			button.classList.remove("menu-wrapper__link_hide")
		}
		profileLink.classList.add("header__item_hide")
		menuLink.classList.add("menu-wrapper__link_hide")
	}
}

const swiper = new Swiper('.swiper', {
	direction: 'horizontal',
	loop: false,
	allowTouchMove: false,

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

const changeWidth = () => {
	for (let slide of slides) {
		slide.style.width = `${width}px`
		slide.querySelector("img").style.width = `${width}px`
	}
	for (let slide of sliderSwiper) {
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

const addText = (text, item, state) => {
	let block = document.createElement("div")
	if (state == "error") {
		block.classList.add("form__error")
	} else if (state == "ok") {
		block.classList.add("form__ok")
	}
	block.innerText = text
	item.insertAdjacentElement("beforeend", block)
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
changeHeaderMenu()

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

for (let button of register) {
	button.addEventListener("click", () => {
		registerSection.classList.remove("form_close")
		body.style.overflow = "hidden"
	})
}

sendMessage.addEventListener("click", () => {
	sendMessageSection.classList.remove("form_close")
	body.style.overflow = "hidden"
})



for (let section of formSections) {
	const form = section.querySelector(".form__main")
	const label = form.querySelector(".form__checkbox-label")
	const closeButton = form.querySelector(".form__close")

	closeButton.addEventListener("click", () => {
		section.classList.add("form_close")
		body.style.overflow = "auto"
	})

	if (label) {
		const submit = form.querySelector(".form__submit")
		label.addEventListener("click", () => {
			if (submit.hasAttribute("disabled")) {
				submit.removeAttribute("disabled")
				submit.classList.remove("form__submit_dis")
				submit.classList.add("form__submit_active")
			} else {
				submit.setAttribute("disabled", true)
				submit.classList.add("form__submit_dis")
				submit.classList.remove("form__submit_active")
			}
		})
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault()

		const submit = form.querySelector(".form__submit")
		// const items = form.querySelectorAll(".form__item")
		let errorExist = false

		for (let item of form.querySelectorAll(".form__item")) {
			const input = item.querySelector(".form__input")
			let error = item.querySelector(".form__error")
			const email = checkEmail.test(input.value)

			if (input.classList.contains("form__input_required") && input.value == "" && !error && input.name != "email") {
				addText("This field is required", item, "error")
				input.classList.add("form__input_empty")
				submit.classList.add("form__submit_error")
				errorExist = true

			} else if (!email && input.name == "email" && input.classList.contains("form__input_required") && !error) {
				addText("Please enter a valid email address (your entry is not in the format \"somebody@example.com\")", item, "error")
				input.classList.add("form__input_empty")
				submit.classList.add("form__submit_error")

			} else if ((error && input.value != "" && input.name != "email") || (error && email)) {
				error.remove()
				input.classList.remove("form__input_empty")
			}

			error = item.querySelector(".form__error")

			if (input.classList.contains("form__input_required") && error) {
				errorExist = true
			}
		}

		if (!errorExist) {
			submit.classList.remove("form__submit_error")
		}

		if (!submit.classList.contains("form__submit_error")) {
			let metaData = {}
			let dataToServer = {}
			let path = "/users"
			let formType = ""
			const inputs = form.querySelectorAll(".form__input")

			for (let input of inputs) {
				dataToServer[input.name] = input.value
			}

			if (section.classList.contains("sign-in")) {
				formType = "login"
				path = "/users/login"
				metaData = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToServer)
				}
			} else if (section.classList.contains("register")) {
				formType = "register"
				path = "/users"
				metaData = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(dataToServer)
				}
			} if (section.classList.contains("send-message")) {

			}

			fetch(`${baseURL}${path}`, metaData)
				.then(response => {
					return response.json()
				})
				.then(({ data }) => {
					switch (formType) {
						case "login":
							localStorage.setItem("token", `${data.token}`)
							localStorage.setItem("userId", `${data.userId}`)
							changeHeaderMenu()
							break
						// case "register":
						// localStorage.setItem("token", `${data.token}`)
						// localStorage.setItem("userId", `${data.userId}`)
						// changeHeaderMenu()
						// break
						default:
							console.log("OK")
					}
					for (let item of form.querySelectorAll(".form__item")) {
						addText("All right", item, "ok")
						item.querySelector("input").classList.add("form__input_ok")
						// input.classList.add
					}
					submit.classList.add("form__submit_ok")
					setTimeout(() => {
						section.classList.add("form_close")
						for (let item of form.querySelectorAll(".form__item")) {
							// addText("All right", item, "ok")
							item.querySelector(".form__ok").remove()
							item.querySelector("input").classList.remove("form__input_ok")
							// input.classList.add
						}
						submit.classList.remove("form__submit_ok")
						body.style.overflow = "auto"
					}, 2000)
				})
				.catch(error => {
					console.log(error)
				})
		}
	})
}

window.addEventListener("resize", () => {
	width = +getComputedStyle(wrapper).width.split("px")[0]
	changeWidth()
})