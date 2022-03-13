const checkEmail = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u

const baseURL = "https://academy.directlinedev.com"

const body = document.querySelector("body")
const menuWrapper = document.querySelector(".menu-wrapper")
const menuButton = document.querySelector(".open-menu-wrapper")
const menuClose = document.querySelector(".menu-wrapper__close")

const formSections = document.querySelectorAll(".form")

const userInfo = document.querySelectorAll(".profile__data")
const userPhoto = document.querySelector(".profile__photo")

const changePass = document.querySelector(".profile__change-pass")
const changeData = document.querySelector(".profile__change-data")
const deleteProfile = document.querySelector(".profile__delete")

const changePassSection = document.querySelector(".change-password")
const changeDataSection = document.querySelector(".change-data")
// const deleteProfileSection = document.querySelector(".profile__delete")

// const formButtons = document.querySelector(".")
const headerLinks = document.querySelectorAll(".header__item")
const activeLink = document.querySelector(".header__item_active")

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

const setData = () => {
	fetch(`${baseURL}/api/users/${localStorage.getItem("userId")}`)
		.then(response => {
			if (response.status) {
				return response.json()
			}

			throw new Error("Пользователь не найден")
		})
		.then(({ data }) => {
			for (let item of userInfo) {
				item.innerText = data[item.getAttribute("name")]
			}
			userPhoto.setAttribute("src", `${baseURL}${data.photoUrl}`)
		})
		.catch(error => {
			console.log(error)
		})
}

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

changeHeaderMenu()
setData()

menuButton.addEventListener("click", () => {
	menuWrapper.classList.remove("menu-wrapper_close")
	body.style.overflow = "hidden"
})

menuClose.addEventListener("click", () => {
	menuWrapper.classList.add("menu-wrapper_close")
	body.style.overflow = "auto"
})

changePass.addEventListener("click", () => {
	changePassSection.classList.remove("form_close")
	body.style.overflow = "hidden"
})

changeData.addEventListener("click", () => {
	changeDataSection.classList.remove("form_close")
	body.style.overflow = "hidden"
})

deleteProfile.addEventListener("click", () => {
	fetch(`${baseURL}/api/users/${localStorage.getItem("userId")}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": localStorage.getItem("token")
		}
	}).then(response => {
		if (response.ok) {
			localStorage.removeItem("token")
			localStorage.removeItem("userId")
			history.back()
		}
		throw new Error("Пользователя не существует")
	}).catch(error => {
		console.error(error)
		localStorage.removeItem("token")
		localStorage.removeItem("userId")
		history.back()
	})
})

for (let section of formSections) {
	const form = section.querySelector(".form__main")
	const closeButton = form.querySelector(".form__close")
	const fileInput = form.querySelector(".form__file-input")
	const fileLabel = form.querySelector(".form__file-label")

	closeButton.addEventListener("click", () => {
		section.classList.add("form_close")
		body.style.overflow = "auto"
	})

	if (fileInput) {
		fileInput.addEventListener("change", (e) => {
			fileLabel.innerText = e.target.files[0].name
		})
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault()

		const submit = form.querySelector(".form__submit")
		let errorExist = false

		for (let item of form.querySelectorAll(".form__item")) {

			let inputFile = false

			if (item.classList.contains("form-input")) {
				item = item.querySelector(".form__file-wrapper")
				inputFile = true
			}

			const input = item.querySelector(".form__input")
			let error = item.querySelector(".form__error")
			let email = true

			if (!inputFile) {
				email = checkEmail.test(input.value)
			}

			if (!inputFile && input.classList.contains("form__input_required") && input.value == "" && !error && input.name != "email") {
				addText("This field is required", item, "error")
				input.classList.add("form__input_empty")
				submit.classList.add("form__submit_error")
				errorExist = true

			} else if (!inputFile && !email && input.name == "email" && input.classList.contains("form__input_required") && !error) {
				addText("Please enter a valid email address (your entry is not in the format \"somebody@example.com\")", item, "error")
				input.classList.add("form__input_empty")
				submit.classList.add("form__submit_error")

			} else if (!inputFile && (error && input.value != "" && input.name != "email") || (error && email)) {
				error.remove()
				input.classList.remove("form__input_empty")
			}

			error = item.querySelector(".form__error")

			if (!inputFile && input.classList.contains("form__input_required") && error) {
				errorExist = true
			}
		}

		if (!errorExist) {
			if (section.classList.contains("change-password")) {
				const newPass = form.querySelector("input[name='newPassword']")
				const newPassRep = form.querySelector("input[name='newPasswordRepeat']")

				if (newPass.value != newPassRep.value) {
					errorExist = true
					addText("Passwords must match", newPassRep.parentElement, "error")
					newPassRep.classList.add("form__input_empty")
					submit.classList.add("form__submit_error")
				}

				if (!errorExist) {
					submit.classList.remove("form__submit_error")
				}

			} else {
				submit.classList.remove("form__submit_error")
			}
		}

		if (!submit.classList.contains("form__submit_error")) {
			let metaData = {}
			let path = "/api/users"
			const inputs = form.querySelectorAll(".form__input")

			if (section.classList.contains("change-data")) {
				let dataToServer = new FormData()
				for (let input of inputs) {
					dataToServer.set(`${input.name}`, `${input.value}`)
				}
				metaData = {
					method: "PUT",
					headers: {
						"x-access-token": localStorage.getItem("token")
					},
					body: dataToServer
				}
			} else if (section.classList.contains("change-password")) {
				let dataToServer = {}
				for (let input of inputs) {
					if (input.name != "newPasswordRepeat") {
						dataToServer[input.name] = input.value
					}
				}

				metaData = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": localStorage.getItem("token")
					},
					body: JSON.stringify(dataToServer)
				}
			}

			fetch(`${baseURL}${path}`, metaData)
				.then(response => {
					if (response.ok) {
						return response.json()
					} else {
						switch (response.status) {
							case 401:
								localStorage.removeItem("token")
								localStorage.removeItem("userId")
								history.back()
								break
							case 422:
								const oldPass = form.querySelector("input[name='oldPassword']")
								addText("Incorrect password", oldPass.parentElement, "error")
								oldPass.classList.add("form__input_empty")
								break
							default:
								throw new Error("Ошибка сервера")
						}
					}
				})
				.then(({ data }) => {
					for (let item of form.querySelectorAll(".form__item")) {
						addText("All right", item, "ok")
						item.querySelector("input").classList.add("form__input_ok")
					}

					submit.classList.add("form__submit_ok")
					setData()
					setTimeout(() => {
						section.classList.add("form_close")
						for (let item of form.querySelectorAll(".form__item")) {
							item.querySelector(".form__ok").remove()
							item.querySelector("input").classList.remove("form__input_ok")
						}
						submit.classList.remove("form__submit_ok")
						body.style.overflow = "auto"
					}, 2000)
				})
				.catch(error => {
					console.error(error)
				})
		}
	})
}