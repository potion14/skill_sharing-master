document.addEventListener("click", e => {
    console.log("wszedlem do skryptu")
    const isProfileButton = e.target.matches("[data-dropdown-button]")
    if (!isProfileButton && e.target.closest("[data-dropdown]") != null) return

    let currentDropdown
    if (isProfileButton) {
        currentDropdown = e.target.closest('[data-dropdown]')
        currentDropdown.classList.toggle('active')
    }

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        if (dropdown === currentDropdown) return
        dropdown.classList.remove('active')
    })
})