import { useState } from "react";
import { TbEyeClosed, TbEye } from "react-icons/tb";
import PropTypes from "prop-types";

const PasswordInput = ({ name, placeholder, onValueChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleInputChange = (event) => {
        onValueChange(event.target.value);
    };

    return (
        <div className="relative">
            <input
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                name={name}
                className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                required
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                    setIsInputFocused(false);
                    setShowPassword(false);
                }}
            />
            {isInputFocused && (
                <button
                    type="button"
                    className="absolute right-2 top-2"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                    }}
                >
                    {showPassword ? (
                        <TbEye className="text-black text-2xl show" />
                    ) : (
                        <TbEyeClosed className="text-black text-2xl hide" />
                    )}
                </button>
            )}
        </div>
    );
};

PasswordInput.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
};

export default PasswordInput;
