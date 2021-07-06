import React from 'react';
import useDarkMode from 'use-dark-mode';
import DarkModeToggle from 'react-dark-mode-toggle';

const DarkModeToggler = () => {
	const darkMode = useDarkMode(false);
	return <DarkModeToggle onChange={darkMode.toggle} checked={darkMode.value} size={75} />;
};

export default DarkModeToggler;
