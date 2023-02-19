import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCloser } from "../hooks/useCloser";
import { RegisterRoute } from "../Routes";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  //! Variable
  let counter = 0;
  let days = [];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let years = [];

  for (let i = 1; i < 32; i++) {
    days.push(i);
  }
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth();
  let day = d.getDate();

  for (let i = year; i >= year - 117; i--) {
    years.push(i);
  }

  //!Use State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstEmail, setFirstEmail] = useState("");
  const [secondEmail, setSecondEmail] = useState("");
  const [gender, setGender] = useState("");
  const [genderPronoun, setGenderPronoun] = useState();
  const [password, setPassword] = useState("");
  // eslint-disable-next-line
  const [birthDay, setBirthDay] = useState(day);
  // eslint-disable-next-line
  const [birthMonth, setBirthMonth] = useState(months[month]);
  const [birthYear, setBirthYear] = useState(year);
  const [age, setAge] = useState("");
  const [optionalGender, setOptionalGender] = useState("");
  //! Checker State
  const [isUsingAge, setIsUsingAge] = useState(false);
  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
  const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isSecondEmailEmpty, setIsSecondEmailEmpty] = useState(false);
  const [isGenderPronounEmpty, setIsGenderPronounEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isBirthYearEmpty, setIsBirthYearEmpty] = useState(false);
  const [isAgeEmpty, setIsAgeEmpty] = useState();
  const [canDateAlert, setCanDateAlert] = useState(false);
  //! Use Ref
  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const firstEmailInput = useRef();
  const secondEmailInput = useRef();
  const passwordInput = useRef();
  const genderPronounInput = useRef();
  const customGender = useRef();
  const ageInput = useRef();
  const birthDayInput = useRef();
  const birthMonthInput = useRef();
  const birthYearInput = useRef();
  const femaleInput = useRef();
  const maleInput = useRef();
  const customInput = useRef();
  //! Custom hook

  const closer = (ref, setState) => {
    setState(false);
    ref.current.classList.toggle("isActive", false);
  };

  const [isDateActive, setIsDateActive, dateDescription] = useCloser(closer);

  const [isGenderActive, setIsGenderActive, genderDescription] =
    useCloser(closer);

  //!Intervals
  const emailInterval = (e) => {
    return setInterval(() => {
      setFirstEmail(e.target.value);
    }, 1000);
  };

  useEffect(() => {
    emailValidation();
    //eslint-disable-next-line
  }, [firstEmail]);
  //!Functions
  const signUpFormCloser = () => {
    counter = 0;
    setIsUsingAge(false);
    const modal = document.querySelector(".modal");
    modal.close();
    //? Resetting the states

    setFirstName("");
    setLastName("");
    setFirstEmail("");
    setSecondEmail("");
    setGender("");
    setGenderPronoun("");
    setPassword("");
    setBirthDay(day);
    setBirthMonth(months[month]);
    setBirthYear(year);

    //? Resetting the checker State
    setCanDateAlert(false);
    setIsAgeEmpty(false);
    setIsBirthYearEmpty(false);
    setIsFirstNameEmpty(false);
    setIsLastNameEmpty(false);
    setIsPasswordEmpty(false);
    setIsSecondEmailEmpty(false);
    setIsGenderPronounEmpty(false);
    setIsEmailEmpty(false);

    firstNameInput.current.style.border = "1px solid gray";
    lastNameInput.current.style.border = "1px solid gray";
    firstEmailInput.current.style.border = "1px solid gray";
    secondEmailInput.current.style.border = "1px solid gray";
    passwordInput.current.style.border = "1px solid gray";
    customGender.current.style.display = "none";
    secondEmailInput.current.style.display = "none";

    document.querySelectorAll("input:checked").forEach((element) => {
      element.checked = false;
    });

    document.querySelectorAll(".selected").forEach((element) => {
      element.selected = "1";
    });
    document.querySelectorAll(".fa-exclamation-circle").forEach((element) => {
      element.style.display = "none";
    });
    document.querySelectorAll("label[data-container]").forEach((element) => {
      element.style.border = "1px solid gray";
    });

    document.querySelectorAll(".date_selection").forEach((element) => {
      element.style.border = "1px solid gray";
    });
  };

  const genderSelector = (e) => {
    if (e.target.value === "Custom") {
      customGender.current.style.display = "flex";
    } else {
      customGender.current.style.display = "none";
    }
    setGender(e.target.value);
  };

  const emailValidation = () => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{1,4})+$/;

    if (regex.test(firstEmail)) {
      secondEmailInput.current.style.display = "inline";
      return true;
    } else {
      secondEmailInput.current.style.display = "none";
      return false;
    }
  };

  //! Focus Handlers

  function inputFocusIn(ref, checkerState) {
    let container = ref.current.parentElement;
    let icon = document.querySelector(`.${ref.current.id}`);

    ref.current.style.border = "1px solid gray";
    icon.style.display = "none";

    if (checkerState) {
      container.style.setProperty("--display", "block");
    }
  }

  function inputFocusOut(ref, state, setCheckerState) {
    let icon = document.querySelector(`.${ref.current.id}`);
    let container = ref.current.parentElement;

    container.style.setProperty("--display", "none");

    if (state === "" || state === " " || !state) {
      ref.current.style.border = "1px solid red";
      icon.style.display = "inline";
      icon.addEventListener(
        "click",
        () => {
          ref.current.focus();
        },
        { once: true }
      );
      setCheckerState(true);
    } else {
      ref.current.style.border = "1px solid gray";
      icon.style.display = "none";
      setCheckerState(false);
    }
  }

  function inputFocusOutForReEnterEmail() {
    let icon = document.querySelector(`.${secondEmailInput.current.id}`);
    let container = secondEmailInput.current.parentElement;

    container.style.setProperty("--display", "none");

    if (
      secondEmail === "" ||
      secondEmail === " " ||
      !secondEmail ||
      secondEmail !== firstEmail
    ) {
      if (secondEmail !== firstEmail) {
        container.setAttribute(
          "data-message",
          "Your email do not match . Please try again"
        );
      }

      if (secondEmail === " " || secondEmail === "") {
        container.setAttribute("data-message", "Please re-enter your email");
      }

      secondEmailInput.current.style.border = "1px solid red";
      icon.style.display = "inline";
      icon.addEventListener(
        "click",
        () => {
          secondEmailInput.current.focus();
        },
        { once: true }
      );
      setIsSecondEmailEmpty(true);
    } else {
      secondEmailInput.current.style.border = "1px solid gray";
      icon.style.display = "none";
      setIsSecondEmailEmpty(false);
    }
  }

  function selectFocusIn(ref, checkerState) {
    const container = ref.current.parentElement;
    if (checkerState && canDateAlert) {
      container.style.setProperty("--display", "block");
    }
    let children = container.children;
    let icon = document.querySelector(`.${ref.current.name}`);

    try {
      for (let i = 0; i <= container.children.length; i++) {
        icon.style.display = "none";
        children[i].style.border = "1px solid gray";
      }
    } catch (e) {}
  }

  function genderFocusIn() {
    if (gender !== " " || gender !== "" || !gender) {
      maleInput.current.style.border = "1px solid gray";
      femaleInput.current.style.border = "1px solid gray";
      customInput.current.style.border = "1px solid gray";
      document.querySelector(".gender").style.display = "none";
    }
  }
  function selectFocusOut(ref, state, setCheckerState) {
    document.addEventListener(
      "click",
      (e) => {
        if (!container.contains(e.target)) {
          setCanDateAlert(true);
        }
      },
      { once: true }
    );
    const container = ref.current.parentElement;
    let children = document.querySelectorAll(`[name=${ref.current.name}]`);
    let icon = document.querySelector(`.${ref.current.name}`);

    container.style.setProperty("--display", "none");

    if (state === "" || state === " " || !state || state > year - 5) {
      icon.style.display = "block";
      setCheckerState(true);
      icon.addEventListener(
        "click",
        () => {
          ref.current.focus();
        },
        { once: true }
      );

      try {
        for (let i = 0; i <= container.children.length; i++) {
          children[i].style.border = "1px solid red";
        }
      } catch (e) {}
    } else {
      setCheckerState(false);
      try {
        for (let i = 0; i <= container.children.length; i++) {
          children[i].style.border = "1px solid gray";
        }
      } catch (e) {}
    }
  }

  return (
    <>
      <dialog
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            signUpFormCloser();
          }
        }}
        className="modal"
        data-signup-form
      >
        <div className="heading">
          <span>
            <h1>Sign up</h1>
            <p> Its quick and easy</p>
          </span>
          <span
            onClick={() => {
              signUpFormCloser();
            }}
          >
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/C6QZ-pcv3Bd.png"
              alt=""
            />
          </span>
        </div>

        <form autoComplete="off" className="signup-form">
          <div className="user_detail">
            <span className="user_name">
              <span
                className="input_container firstNameContainer"
                data-message="What's your name?"
              >
                <input
                  value={firstName}
                  ref={firstNameInput}
                  onFocus={() => {
                    inputFocusIn(firstNameInput, isFirstNameEmpty);
                  }}
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  onBlur={() => {
                    inputFocusOut(
                      firstNameInput,
                      firstName,
                      setIsFirstNameEmpty
                    );
                  }}
                />
                <i className="fas fa-exclamation-circle firstName"></i>
              </span>

              <span
                className="input_container lastNameContainer"
                data-message="What's your name?"
              >
                <input
                  value={lastName}
                  ref={lastNameInput}
                  onFocus={() => {
                    inputFocusIn(lastNameInput, isLastNameEmpty);
                  }}
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Surname"
                  required
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  onBlur={() => {
                    inputFocusOut(lastNameInput, lastName, setIsLastNameEmpty);
                  }}
                />

                <i className="fas fa-exclamation-circle lastName"></i>
              </span>
            </span>

            <span
              className="input_container"
              data-message="You'll use this when you login and if you ever need to reset your password"
            >
              <input
                autoComplete="nope"
                value={firstEmail}
                ref={firstEmailInput}
                onFocus={(e) => {
                  inputFocusIn(firstEmailInput, isEmailEmpty);
                  console.log(e.target.value);
                  emailInterval(e);
                }}
                onBlur={() => {
                  inputFocusOut(firstEmailInput, firstEmail, setIsEmailEmpty);
                }}
                type="email"
                placeholder="Email Address "
                id="email"
                onInput={(e) => {
                  setFirstEmail(e.target.value);
                  emailValidation();
                }}
              />

              <i className="fas fa-exclamation-circle email"></i>
            </span>

            <span
              className="input_container"
              data-message="Please re-enter your email"
            >
              <input
                value={secondEmail}
                onFocus={() => {
                  inputFocusIn(secondEmailInput, isSecondEmailEmpty);
                }}
                onBlur={() => {
                  inputFocusOutForReEnterEmail();
                }}
                className="second_email"
                ref={secondEmailInput}
                type="email"
                placeholder="Re-Enter Email Address"
                id="ReEnterEmail"
                onChange={(e) => {
                  if (secondEmail !== firstEmail) {
                    setIsSecondEmailEmpty(true);
                  }
                  setSecondEmail(e.target.value);
                }}
              />
              <i className="fas fa-exclamation-circle ReEnterEmail"></i>
            </span>

            <span
              className="input_container"
              data-message="Enter a combination of at least six number,letters and punctuation marks (such as ! and &) "
            >
              <input
                value={password}
                ref={passwordInput}
                autoComplete="nope"
                onFocus={() => {
                  inputFocusIn(passwordInput, isPasswordEmpty);
                }}
                onBlur={() => {
                  inputFocusOut(passwordInput, password, setIsPasswordEmpty);
                }}
                type="password"
                name="password"
                id="password"
                placeholder="New Password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <i className="fas fa-exclamation-circle password"></i>
            </span>
          </div>

          {!isUsingAge && (
            <div className="user_date_of_birth">
              <p>
                <span
                  className="date_of_birth_description"
                  ref={dateDescription}
                >
                  <strong>Providing your birthday </strong> helps make sure that
                  you get the right Facebook experience for your age. If you
                  want to change who sees this, go to the About section of your
                  profile. For more details, please visit our
                  <a href="https://www.facebook.com/privacy/policy/?entry_point=data_policy_redirect&entry=0">
                    {" "}
                    Privacy Policy.
                  </a>
                </span>
                Birthday{" "}
                <span className="question_mark_container">
                  {!isDateActive && (
                    <svg
                      onClick={() => {
                        dateDescription.current.classList.add("isActive");
                        setIsDateActive(true);
                      }}
                      className="question_mark"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="93.936px"
                      height="93.936px"
                      viewBox="0 0 93.936 93.936"
                      fill="#6a6e6d"
                    >
                      <g>
                        <path d="M80.179,13.758c-18.342-18.342-48.08-18.342-66.422,0c-18.342,18.341-18.342,48.08,0,66.421   c18.342,18.342,48.08,18.342,66.422,0C98.521,61.837,98.521,32.099,80.179,13.758z M44.144,83.117   c-4.057,0-7.001-3.071-7.001-7.305c0-4.291,2.987-7.404,7.102-7.404c4.123,0,7.001,3.044,7.001,7.404   C51.246,80.113,48.326,83.117,44.144,83.117z M54.73,44.921c-4.15,4.905-5.796,9.117-5.503,14.088l0.097,2.495   c0.011,0.062,0.017,0.125,0.017,0.188c0,0.58-0.47,1.051-1.05,1.051c-0.004-0.001-0.008-0.001-0.012,0h-7.867   c-0.549,0-1.005-0.423-1.047-0.97l-0.202-2.623c-0.676-6.082,1.508-12.218,6.494-18.202c4.319-5.087,6.816-8.865,6.816-13.145   c0-4.829-3.036-7.536-8.548-7.624c-3.403,0-7.242,1.171-9.534,2.913c-0.264,0.201-0.607,0.264-0.925,0.173   s-0.575-0.327-0.693-0.636l-2.42-6.354c-0.169-0.442-0.02-0.943,0.364-1.224c3.538-2.573,9.441-4.235,15.041-4.235   c12.36,0,17.894,7.975,17.894,15.877C63.652,33.765,59.785,38.919,54.73,44.921z" />
                      </g>
                    </svg>
                  )}

                  {isDateActive && (
                    <svg
                      onClick={() => {
                        dateDescription.current.classList.remove("isActive");
                        setIsDateActive(false);
                      }}
                      className="question_mark"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="93.936px"
                      height="93.936px"
                      viewBox="0 0 93.936 93.936"
                      fill="#6a6e6d"
                    >
                      <g>
                        <path d="M80.179,13.758c-18.342-18.342-48.08-18.342-66.422,0c-18.342,18.341-18.342,48.08,0,66.421   c18.342,18.342,48.08,18.342,66.422,0C98.521,61.837,98.521,32.099,80.179,13.758z M44.144,83.117   c-4.057,0-7.001-3.071-7.001-7.305c0-4.291,2.987-7.404,7.102-7.404c4.123,0,7.001,3.044,7.001,7.404   C51.246,80.113,48.326,83.117,44.144,83.117z M54.73,44.921c-4.15,4.905-5.796,9.117-5.503,14.088l0.097,2.495   c0.011,0.062,0.017,0.125,0.017,0.188c0,0.58-0.47,1.051-1.05,1.051c-0.004-0.001-0.008-0.001-0.012,0h-7.867   c-0.549,0-1.005-0.423-1.047-0.97l-0.202-2.623c-0.676-6.082,1.508-12.218,6.494-18.202c4.319-5.087,6.816-8.865,6.816-13.145   c0-4.829-3.036-7.536-8.548-7.624c-3.403,0-7.242,1.171-9.534,2.913c-0.264,0.201-0.607,0.264-0.925,0.173   s-0.575-0.327-0.693-0.636l-2.42-6.354c-0.169-0.442-0.02-0.943,0.364-1.224c3.538-2.573,9.441-4.235,15.041-4.235   c12.36,0,17.894,7.975,17.894,15.877C63.652,33.765,59.785,38.919,54.73,44.921z" />
                      </g>
                    </svg>
                  )}
                </span>
                <i
                  style={{ display: "none" }}
                  className="fas fa-exclamation-circle date_of_birth"
                ></i>
              </p>

              <div
                className="date"
                data-message="It looks like you've entered the wrong info. Please make sure that you use your real date of birth"
              >
                <select
                  tabIndex={0}
                  value={birthDay}
                  name="date_of_birth"
                  ref={birthDayInput}
                  id="day"
                  className="date_selection"
                  onChange={(e) => {
                    setBirthDay(e.target.value);
                  }}
                  onFocus={() => {
                    selectFocusIn(birthDayInput, isBirthYearEmpty);
                  }}
                  onBlur={() => {
                    selectFocusOut(
                      birthDayInput,
                      birthYear,
                      setIsBirthYearEmpty
                    );
                  }}
                  required
                >
                  {days.map((element) => {
                    return (
                      <option value={element} key={element}>
                        {element}
                      </option>
                    );
                  })}
                </select>

                <select
                  tabIndex={0}
                  value={birthMonth}
                  name="date_of_birth"
                  ref={birthMonthInput}
                  id="month"
                  className="date_selection"
                  onChange={(e) => {
                    setBirthMonth(e.target.value);
                  }}
                  onFocus={() => {
                    selectFocusIn(birthMonthInput, isBirthYearEmpty);
                  }}
                  onBlur={() => {
                    selectFocusOut(
                      birthMonthInput,
                      birthYear,
                      setIsBirthYearEmpty
                    );
                  }}
                  required
                >
                  {months.map((element, index) => {
                    return (
                      <option value={element} key={element}>
                        {element}
                      </option>
                    );
                  })}
                </select>

                <select
                  tabIndex={0}
                  value={birthYear}
                  name="date_of_birth"
                  ref={birthYearInput}
                  id="year"
                  className="date_selection"
                  onChange={(e) => {
                    setBirthYear(e.target.value);
                  }}
                  onFocus={() => {
                    selectFocusIn(birthYearInput, isBirthYearEmpty);
                  }}
                  onBlur={() => {
                    selectFocusOut(
                      birthYearInput,
                      birthYear,
                      setIsBirthYearEmpty
                    );
                  }}
                  required
                >
                  {years.map((element) => {
                    return (
                      <option value={element} key={element}>
                        {element}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {isUsingAge && (
            <div className="user_age">
              <p>Age</p>
              <span>
                <span
                  className="input_container ageContainer"
                  data-message="Please enter your age"
                >
                  <input
                    type="text"
                    value={age}
                    ref={ageInput}
                    onFocus={() => {
                      inputFocusIn(ageInput, isAgeEmpty);
                    }}
                    onBlur={() => {
                      inputFocusOut(ageInput, age, setIsAgeEmpty);
                    }}
                    name="age"
                    id="age"
                    placeholder="Your Age"
                    required
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                  />

                  <i className="fas fa-exclamation-circle age"></i>
                </span>

                <p
                  className="link_to_date"
                  onClick={() => {
                    setIsUsingAge(false);
                    counter = 0;
                  }}
                >
                  Use date of birth
                </p>
              </span>
            </div>
          )}

          <div className="user_gender">
            <p>
              <span className="user_gender_description" ref={genderDescription}>
                You can change who sees your gender on your profile later.
                Select Custom to choose another gender, or if you'd rather not
                say.
              </span>
              Gender{" "}
              <span className="question_mark_container">
                {!isGenderActive && (
                  <svg
                    onClick={() => {
                      genderDescription.current.classList.add("isActive");
                      setIsGenderActive(true);
                    }}
                    className="question_mark"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="93.936px"
                    height="93.936px"
                    viewBox="0 0 93.936 93.936"
                    fill="#6a6e6d"
                  >
                    <g>
                      <path d="M80.179,13.758c-18.342-18.342-48.08-18.342-66.422,0c-18.342,18.341-18.342,48.08,0,66.421   c18.342,18.342,48.08,18.342,66.422,0C98.521,61.837,98.521,32.099,80.179,13.758z M44.144,83.117   c-4.057,0-7.001-3.071-7.001-7.305c0-4.291,2.987-7.404,7.102-7.404c4.123,0,7.001,3.044,7.001,7.404   C51.246,80.113,48.326,83.117,44.144,83.117z M54.73,44.921c-4.15,4.905-5.796,9.117-5.503,14.088l0.097,2.495   c0.011,0.062,0.017,0.125,0.017,0.188c0,0.58-0.47,1.051-1.05,1.051c-0.004-0.001-0.008-0.001-0.012,0h-7.867   c-0.549,0-1.005-0.423-1.047-0.97l-0.202-2.623c-0.676-6.082,1.508-12.218,6.494-18.202c4.319-5.087,6.816-8.865,6.816-13.145   c0-4.829-3.036-7.536-8.548-7.624c-3.403,0-7.242,1.171-9.534,2.913c-0.264,0.201-0.607,0.264-0.925,0.173   s-0.575-0.327-0.693-0.636l-2.42-6.354c-0.169-0.442-0.02-0.943,0.364-1.224c3.538-2.573,9.441-4.235,15.041-4.235   c12.36,0,17.894,7.975,17.894,15.877C63.652,33.765,59.785,38.919,54.73,44.921z" />
                    </g>
                  </svg>
                )}

                {isGenderActive && (
                  <svg
                    onClick={() => {
                      genderDescription.current.classList.remove("isActive");
                      setIsGenderActive(false);
                    }}
                    className="question_mark"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="93.936px"
                    height="93.936px"
                    viewBox="0 0 93.936 93.936"
                    fill="#6a6e6d"
                  >
                    <g>
                      <path d="M80.179,13.758c-18.342-18.342-48.08-18.342-66.422,0c-18.342,18.341-18.342,48.08,0,66.421   c18.342,18.342,48.08,18.342,66.422,0C98.521,61.837,98.521,32.099,80.179,13.758z M44.144,83.117   c-4.057,0-7.001-3.071-7.001-7.305c0-4.291,2.987-7.404,7.102-7.404c4.123,0,7.001,3.044,7.001,7.404   C51.246,80.113,48.326,83.117,44.144,83.117z M54.73,44.921c-4.15,4.905-5.796,9.117-5.503,14.088l0.097,2.495   c0.011,0.062,0.017,0.125,0.017,0.188c0,0.58-0.47,1.051-1.05,1.051c-0.004-0.001-0.008-0.001-0.012,0h-7.867   c-0.549,0-1.005-0.423-1.047-0.97l-0.202-2.623c-0.676-6.082,1.508-12.218,6.494-18.202c4.319-5.087,6.816-8.865,6.816-13.145   c0-4.829-3.036-7.536-8.548-7.624c-3.403,0-7.242,1.171-9.534,2.913c-0.264,0.201-0.607,0.264-0.925,0.173   s-0.575-0.327-0.693-0.636l-2.42-6.354c-0.169-0.442-0.02-0.943,0.364-1.224c3.538-2.573,9.441-4.235,15.041-4.235   c12.36,0,17.894,7.975,17.894,15.877C63.652,33.765,59.785,38.919,54.73,44.921z" />
                    </g>
                  </svg>
                )}
              </span>
              <i
                style={{ display: "none" }}
                className="fas fa-exclamation-circle gender"
              ></i>
            </p>

            <div
              className="gender_selection"
              data-message="Please chose gender. You can who can see this later"
            >
              <label
                tabIndex={0}
                ref={femaleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("female").checked = true;
                  }
                }}
                htmlFor="female"
                data-container
              >
                <label htmlFor="female">Female</label>
                <input
                  tabIndex={-1}
                  onFocus={() => {
                    genderFocusIn();
                  }}
                  type="radio"
                  name="gender"
                  id="female"
                  value={"Female"}
                  onChange={genderSelector}
                />
              </label>

              <label
                tabIndex={0}
                ref={maleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("male").checked = true;
                  }
                }}
                htmlFor="male"
                data-container
              >
                <label htmlFor="male">Male</label>
                <input
                  tabIndex={-1}
                  onFocus={() => {
                    genderFocusIn();
                  }}
                  type="radio"
                  name="gender"
                  id="male"
                  value={"Male"}
                  onChange={genderSelector}
                />
              </label>
              <label
                tabIndex={0}
                ref={customInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("custom").checked = true;
                  }
                }}
                htmlFor="custom"
                data-container
              >
                <label htmlFor="custom">Custom</label>
                <input
                  tabIndex={-1}
                  onFocus={() => {
                    genderFocusIn();
                  }}
                  type="radio"
                  name="gender"
                  id="custom"
                  value={"Custom"}
                  onChange={genderSelector}
                />
              </label>
            </div>
          </div>

          <div ref={customGender} className="custom_gender">
            <span
              className="select_container"
              data-message="Please select your pronoun"
            >
              <select
                value={1}
                ref={genderPronounInput}
                onFocus={() => {
                  inputFocusIn(genderPronounInput, isGenderPronounEmpty);
                }}
                onBlur={() => {
                  inputFocusOut(
                    genderPronounInput,
                    genderPronoun,
                    setIsGenderPronounEmpty
                  );
                }}
                required
                className="gender-pronoun"
                name="pronoun"
                id="pronoun"
                onChange={(e) => {
                  setGenderPronoun(e.target.value);
                }}
              >
                <option className="selected" disabled="1" value={1}>
                  Select your pronoun
                </option>
                <option value={'She: "Wish her a happy birthday!"'}>
                  She: "Wish her a happy birthday!"
                </option>
                <option value={'He: "Wish him a happy birthday!"'}>
                  He: "Wish him a happy birthday!"
                </option>
                <option value={'They: "Wish them a happy birthday!"'}>
                  They: "Wish them a happy birthday!"
                </option>
              </select>

              <i className="fas fa-exclamation-circle pronoun"></i>
            </span>

            <p className="pronoun_description">
              Your pronoun will be visible to other
            </p>

            <span className="input_container">
              <input
                type="text"
                name="customGender"
                id="customGender"
                placeholder="Gender (optional)"
                onChange={(e) => {
                  setOptionalGender(e.target.value);
                }}
              />
            </span>
          </div>

          <footer className="signup_footer">
            <p className="footer_information">
              People who use our service may have uploaded your contact
              information to Facebook.{" "}
              <a
                href="https://www.facebook.com/help/637205020878504"
                target={"_blank"}
                rel="noreferrer"
              >
                Learn more.
              </a>
            </p>
            <p className="footer_information">
              By clicking Sign Up, you agree to our{" "}
              <a
                href="https://www.facebook.com/legal/terms/update"
                target={"_blank"}
                rel="noreferrer"
              >
                Terms
              </a>
              ,{" "}
              <a
                href="https://www.facebook.com/privacy/policy/?entry_point=data_policy_redirect&entry=0"
                target={"_blank"}
                rel="noreferrer"
              >
                {" "}
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://www.facebook.com/policies/cookies/"
                target={"_blank"}
                rel="noreferrer"
              >
                Cookies Policy.{" "}
              </a>{" "}
              You may receive SMS notifications from us and can opt out at any
              time.
            </p>
          </footer>
        </form>
        <div className="signup_button_container">
          <button
            className="signup_button"
            onClick={(e) => {
              valueChecker();
            }}
          >
            Sign Up
          </button>
          <div className="center">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
      </dialog>
    </>
  );

  async function valueChecker() {
    if (isBirthYearEmpty) {
      counter++;
    }
    if (counter > 1) {
      setIsUsingAge(true);
    }

    if (gender === "" || gender === " " || !gender) {
      let icon = document.querySelector(".gender");
      icon.style.display = "inline";
      document.querySelectorAll("label[data-container]").forEach((element) => {
        element.style.border = "1px solid red";
      });

      icon.addEventListener("click", () => {
        maleInput.current.parentElement.style.setProperty("--display", "block");

        document.addEventListener(
          "click",
          () => {
            maleInput.current.parentElement.style.setProperty(
              "--display",
              "none"
            );
          },
          true,
          { once: true }
        );
      });
    }

    inputFocusOut(firstNameInput, firstName, setIsFirstNameEmpty);
    inputFocusOut(lastNameInput, lastName, setIsLastNameEmpty);
    inputFocusOut(firstEmailInput, firstEmail, setIsEmailEmpty);

    if (secondEmailInput.current.style.display === "inline") {
      inputFocusOut(secondEmailInput, secondEmail, setIsSecondEmailEmpty);
    }

    inputFocusOut(passwordInput, password, setIsPasswordEmpty);
    selectFocusOut(birthYearInput, birthYear, setIsBirthYearEmpty);
    firstNameInput.current.focus();

    if (
      !isFirstNameEmpty &&
      !isLastNameEmpty &&
      !isEmailEmpty &&
      !isSecondEmailEmpty &&
      !isPasswordEmpty &&
      (gender !== "" || gender !== " ") &&
      (!isBirthYearEmpty || (isUsingAge && !isAgeEmpty))
    ) {
      document.querySelector(".signup_button").disabled = true;
      document.querySelector(".center").style.display = "flex";
      let data = await axios.post(
        RegisterRoute,
        {
          firstName,
          lastName,
          firstEmail,
          secondEmail,
          password,
          gender,
          dateOfBirth: `${birthYear}-${
            birthMonth !== "" || birthMonth !== " "
              ? months.indexOf(birthMonth) + 1
              : month
          }-${birthDay !== "" || birthDay !== " " ? birthDay : day}`,
          genderPronoun:
            genderPronoun !== " " || genderPronoun !== ""
              ? genderPronoun
              : null,
          age: age !== " " || age !== "" ? age : null,
          optionalGender:
            optionalGender !== " " || optionalGender !== ""
              ? optionalGender
              : null,
        },
        { withCredentials: true }
      );
      console.log(data);
      signUpFormCloser();
      router.push({
        pathname: "/verify",
        query: { email: secondEmail, otpLength: data.data.otpLength },
      });
      // navigate('/verify',{state:

      //   { email:secondEmail,
      //     otpLength:data.data.otpLength
      // }})
    }
  }
}
