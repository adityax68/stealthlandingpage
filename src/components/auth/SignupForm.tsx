import React, { useState, useEffect, useRef } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Calendar, Search, ChevronDown } from 'lucide-react'
import { Country, State, City } from 'country-state-city'
import type { ICountry, IState, ICity } from 'country-state-city'

interface SignupFormProps {
  onSignup: (signupData: SignupData) => void
  onSwitchToLogin: () => void
  isLoading?: boolean
  error?: string
}

interface SignupData {
  name: string
  email: string
  password: string
  age: number
  country: string
  state: string
  city: string
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin, isLoading = false, error }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [age, setAge] = useState('')
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Country, state, city data
  const [countries, setCountries] = useState<ICountry[]>([])
  const [states, setStates] = useState<IState[]>([])
  const [cities, setCities] = useState<ICity[]>([])
  
  // Search states
  const [countrySearch, setCountrySearch] = useState('')
  const [stateSearch, setStateSearch] = useState('')
  const [citySearch, setCitySearch] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  
  // Refs for dropdowns
  const countryRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<HTMLDivElement>(null)
  const cityRef = useRef<HTMLDivElement>(null)

  // Load countries on component mount
  useEffect(() => {
    setCountries(Country.getAllCountries())
  }, [])

  // Update states when country changes
  useEffect(() => {
    if (country) {
      setStates(State.getStatesOfCountry(country))
      setState('') // Reset state selection
      setCity('') // Reset city selection
      setStateSearch('')
      setCitySearch('')
    } else {
      setStates([])
      setState('')
      setCity('')
      setStateSearch('')
      setCitySearch('')
    }
  }, [country])

  // Update cities when state changes
  useEffect(() => {
    if (state && country) {
      setCities(City.getCitiesOfState(country, state))
      setCity('') // Reset city selection
      setCitySearch('')
    } else {
      setCities([])
      setCity('')
      setCitySearch('')
    }
  }, [state, country])

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setShowStateDropdown(false)
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtered data
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  )
  const filteredStates = states.filter(s => 
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  )
  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  )

  // Password validation functions
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  const hasMinLength = password.length >= 8

  const passwordRequirements = [
    { text: 'At least 8 characters', isValid: hasMinLength },
    { text: 'One uppercase letter', isValid: hasUppercase },
    { text: 'One lowercase letter', isValid: hasLowercase },
    { text: 'One number', isValid: hasNumber },
    { text: 'One special character', isValid: hasSpecialChar }
  ]

  const isPasswordValid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasMinLength
  const isAgeValid = age && parseInt(age) >= 1 && parseInt(age) <= 120

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword || !isPasswordValid || !isAgeValid) {
      return
    }
    
    const signupData: SignupData = {
      name,
      email,
      password,
      age: parseInt(age),
      country: countries.find(c => c.isoCode === country)?.name || '',
      state: states.find(s => s.isoCode === state)?.name || '',
      city: cities.find(c => c.name === city)?.name || city
    }
    
    onSignup(signupData)
  }

  const passwordsMatch = password === confirmPassword || confirmPassword === ''

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-6 bg-white/90 backdrop-blur-xl border border-primary-start/20 rounded-3xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h2>
          <p className="text-gray-600 text-sm">Join us to start your mental health journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-red-700 text-sm font-medium">Registration Error</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name and Email in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300 text-sm"
                  placeholder="Full name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300 text-sm"
                  placeholder="Email address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Age and Location in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="age" className="block text-xs font-medium text-gray-700 mb-1">
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300 text-sm"
                  placeholder="Age"
                  min="1"
                  max="120"
                  required
                />
              </div>
              {age && !isAgeValid && (
                <p className="mt-1 text-red-300 text-xs">Age must be 1-120</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative" ref={countryRef}>
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  onFocus={() => setShowCountryDropdown(true)}
                  className="w-full pl-8 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300 text-sm"
                  placeholder="Search country"
                />
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                
                {showCountryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredCountries.slice(0, 10).map((countryItem) => (
                      <button
                        key={countryItem.isoCode}
                        type="button"
                        onClick={() => {
                          setCountry(countryItem.isoCode)
                          setCountrySearch(countryItem.name)
                          setShowCountryDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left text-white hover:bg-white/10 text-sm"
                      >
                        {countryItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* State and City in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State
              </label>
              <div className="relative" ref={stateRef}>
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  onFocus={() => setShowStateDropdown(true)}
                  disabled={!country}
                  className="w-full pl-8 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Search state"
                />
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                
                {showStateDropdown && country && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredStates.slice(0, 10).map((stateItem) => (
                      <button
                        key={stateItem.isoCode}
                        type="button"
                        onClick={() => {
                          setState(stateItem.isoCode)
                          setStateSearch(stateItem.name)
                          setShowStateDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left text-white hover:bg-white/10 text-sm"
                      >
                        {stateItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City
              </label>
              <div className="relative" ref={cityRef}>
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onFocus={() => setShowCityDropdown(true)}
                  disabled={!state}
                  className="w-full pl-8 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Search city"
                />
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                
                {showCityDropdown && state && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredCities.slice(0, 10).map((cityItem) => (
                      <button
                        key={cityItem.name}
                        type="button"
                        onClick={() => {
                          setCity(cityItem.name)
                          setCitySearch(cityItem.name)
                          setShowCityDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left text-white hover:bg-white/10 text-sm"
                      >
                        {cityItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Password fields in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300 text-sm"
                  placeholder="Create password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-8 pr-8 py-2 bg-white/10 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300 text-sm ${
                    confirmPassword && !passwordsMatch
                      ? 'border-red-500/50 focus:ring-red-500'
                      : 'border-white/20'
                  }`}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-red-300 text-xs">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Compact Password Requirements */}
          {password && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {passwordRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                    requirement.isValid 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    {requirement.isValid ? (
                      <svg className="w-2 h-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-2 h-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`${
                    requirement.isValid ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {requirement.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !passwordsMatch || !isPasswordValid || !isAgeValid}
            className="w-full py-2 px-4 bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-start hover:text-primary-end font-medium transition-colors duration-300 cursor-pointer hover:underline"
              type="button"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm 