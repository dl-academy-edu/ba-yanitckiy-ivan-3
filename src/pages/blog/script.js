const checkEmail = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u

const baseURL = "https://academy.directlinedev.com/api"
const baseImageURL = "https://academy.directlinedev.com"

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

const filtersForm = document.querySelector(".form-settings")
const resetButton = document.querySelector(".form-settings__reset")
const blogContainer = document.querySelector(".blogs__posts")

const sendStandartRequest = () => {

	let tags = []
	let filter = {}
	let filterText = ""
	let params = ""

	if (localStorage.getItem("commentsCount") != undefined) {
		document.querySelector(`#form-settings__comments_${localStorage.getItem("commentsCount")}`).checked = true
	}

	if (localStorage.getItem("limit") != undefined) {
		document.querySelector(`#form-settings__show_${localStorage.getItem("limit")}`).checked = true
	}

	if (localStorage.getItem("sort") != undefined) {
		document.querySelector(`#form-settings__sort_${localStorage.getItem("sort")}`).checked = true
	}

	if (localStorage.getItem("views") != undefined) {
		document.querySelector(`#form-settings__views_${localStorage.getItem("views")}`).checked = true
	}

	if (localStorage.getItem("tags") != undefined) {
		for (tag of localStorage.getItem("tags")) {
			if (tag != ",") {
				document.querySelector(`#form-settings__tags_${tag}`).checked = true
			}
		}
	}

	for (let input of filtersForm.querySelectorAll("input")) {
		switch (input.name) {
			case "commentsCount":
				if (input.checked) {
					filter[input.name] = input.value
				}
				break

			case "limit":
				if (input.checked) {
					params = `${params}&${input.name}=${input.value}`
				}
				break

			case "sort":
				if (input.checked) {
					params = `${params}&${input.name}=["${input.value}","ASC"]`
				}
				break
			case "views":
				if (input.checked) {
					filter[input.name] = input.value
				}
				break
			case "tags":
				if (input.checked) {
					tags.push(input.value)
				}
				break
		}
	}

	if (tags.length != 0) {
		params = `${params}&tags=[${tags}]`
	}

	for (elem in filter) {
		filterText = `${filterText}"${elem}":${filter[elem]},`
	}

	if (params.length == 0) {
		params = `${params}filter={${filterText.slice(0, -1)}}`
	} else {
		params = `${params}&filter={${filterText.slice(0, -1)}}`
	}

	let newUrl = `${baseURL}/posts?${params}`


	fetch(newUrl, {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	})
		.then(response => {
			return response.json()
		})
		.then(({ data }) => {
			if (blogContainer.querySelector(".blog")) {
				for (item of blogContainer.querySelectorAll(".blog")) {
					item.remove()
				}
			}
			for (let item of data) {
				addBlog(item)
			}
		})
		.catch(error => {
			console.log(error)
		})
}

const addBlog = (data) => {
	let tags = ``

	for (tag of data.tags) {
		tags = `${tags}
		<div class="blog__tag blog__tag_${tag.tag.id}"></div>`
	}

	let date = new Date(data.date)
	let blog = `
		<div class="blog">
			<picture class="blog__img">
				<source srcset="${baseImageURL}${data.mobilePhotoUrl}" media="(max-width: 678px)">
				<source srcset="${baseImageURL}${data.tabletPhotoUrl}" media="(max-width: 834px)">
				<img src="${baseImageURL}${data.desktopPhotoUrl}" alt="main portfolio image">
			</picture>
			<div class="blog__content">
				<div class="blog__tags">${tags}</div>
				<div class="blog__metadata">
					<div class="blog__item blog__item_data">${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}</div>
					<div class="blog__item blog__item_views">${data.views} views</div>
					<div class="blog__item blog__item_comments">${data.commentsCount} comments</div>
				</div>
				<div class="blog__title">${data.title}</div>
				<div class="blog__text">${data.text}</div>
				<a href="#" class="blog__link">Go to this post</a>
			</div>
		</div>
	`
	blogContainer.insertAdjacentHTML("beforeend", blog)
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

changeHeaderMenu()

menuButton.addEventListener("click", () => {
	menuWrapper.classList.remove("menu-wrapper_close")
	body.style.overflow = "hidden"
})

menuClose.addEventListener("click", () => {
	menuWrapper.classList.add("menu-wrapper_close")
	body.style.overflow = "auto"
})

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
						default:
							console.log("OK")
					}
					for (let item of form.querySelectorAll(".form__item")) {
						addText("All right", item, "ok")
						item.querySelector("input").classList.add("form__input_ok")
					}
					submit.classList.add("form__submit_ok")
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
					console.log(error)
				})
		}
	})
}

filtersForm.addEventListener("submit", (e) => {
	e.preventDefault()

	let tags = []
	let filter = {}
	let filterText = ""
	let params = ""

	for (let input of filtersForm.querySelectorAll("input")) {
		switch (input.name) {
			case "title":
				if (input.value != "") {
					filter[input.name] = input.value
				}
				break
			case "commentsCount":
				if (input.checked) {
					filter[input.name] = input.value
					localStorage.setItem("commentsCount", input.id.charAt(input.id.length - 1))
				}
				break

			case "limit":
				if (input.checked) {
					params = `${params}&${input.name}=${input.value}`
					localStorage.setItem("limit", input.id.charAt(input.id.length - 1))
				}
				break

			case "sort":
				if (input.checked) {
					params = `${params}&${input.name}=["${input.value}","ASC"]`
					localStorage.setItem("sort", input.id.charAt(input.id.length - 1))
				}
				break
			case "views":
				if (input.checked) {
					filter[input.name] = input.value
					localStorage.setItem("views", input.id.charAt(input.id.length - 1))
				}
				break
			case "tags":
				if (input.checked) {
					tags.push(input.value)
				}
				break
			default:

		}
	}

	if (tags.length != 0) {
		params = `${params}&tags=[${tags}]`
		localStorage.setItem("tags", tags.toString())
	}

	for (elem in filter) {
		if (elem == "title") {
			filterText = `${filterText}"${elem}":"${filter[elem]}",`
		} else {
			filterText = `${filterText}"${elem}":${filter[elem]},`
		}
	}

	if (params.length == 0) {
		params = `${params}filter={${filterText.slice(0, -1)}}`
	} else {
		params = `${params}&filter={${filterText.slice(0, -1)}}`
	}

	let newUrl = `${baseURL}/posts?${params}`

	fetch(newUrl, {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	})
		.then(response => {
			return response.json()
		})
		.then(({ data }) => {
			if (blogContainer.querySelector(".blog")) {
				for (item of blogContainer.querySelectorAll(".blog")) {
					item.remove()
				}
			}
			for (let item of data) {
				addBlog(item)
			}
		})
		.catch(error => {
			console.log(error)
		})
})

resetButton.addEventListener("click", () => {
	for (let input of filtersForm.querySelectorAll("input")) {
		if (input.type != "text") {
			input.checked = false
		} else {
			input.value = ""
		}
	}

	if (localStorage.getItem("commentsCount") != undefined) {
		localStorage.removeItem("commentsCount")
	}

	if (localStorage.getItem("limit") != undefined) {
		localStorage.removeItem("limit")
	}

	if (localStorage.getItem("sort") != undefined) {
		localStorage.removeItem("sort")
	}

	if (localStorage.getItem("views") != undefined) {
		localStorage.removeItem("views")
	}

	if (localStorage.getItem("tags") != undefined) {
		localStorage.removeItem("tags")
	}

	fetch(`${baseURL}/posts`, {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	})
		.then(response => {
			return response.json()
		})
		.then(({ data }) => {
			if (blogContainer.querySelector(".blog")) {
				for (item of blogContainer.querySelectorAll(".blog")) {
					item.remove()
				}
			}
			for (let item of data) {
				addBlog(item)
			}
		})
		.catch(error => {
			console.log(error)
		})
})

sendStandartRequest()