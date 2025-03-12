import React, { useState, useEffect } from "react";
import { fetchDogs, generateMatch, fetchBreeds, fetchDogDetails, fetchLocations, searchLocations, logout, fetchDogsWithAppendUrl } from '../api/api'
import { FetchDogsParams, FetchDogsResponse, Match, Dog } from "../api/types/Dogs";
import { Location, SearchLocationsParams } from "../api/types/Location";
import DogCard from "../components/DogCard/DogCard";
import './SearchPage.css'
import Modal from "../components/Modal/Modal";

interface SearchPageProps {
    onLogout: () => void
}

const SearchPage: React.FC<SearchPageProps> = ({ onLogout }) => {
    const [breeds, setBreeds] = useState<string[]>([])
    const [dogs, setDogs] = useState<Dog[]>([])
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState<FetchDogsParams>({
        breed: [],
        zipCodes: [],
        ageMax: undefined,
        ageMin: undefined,
        size: 25,
        sort: 'breed:asc'
    })
    const [favorites, setFavorites] = useState<string[]>([])
    const [match, setMatch] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line
    const [locations, setLocations] = useState<Location[]>([])
    const [selectedState, setSelectedState] = useState<string>('')
    const [selectedCity, setSelectedCity] = useState<string>('')
    const [prevPage, setPrevPage] = useState<string | null>(null)
    const [nextPage, setNextPage] = useState<string | null>(null)
    const [states, setStates] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedBreed, setSelectedBreed] = useState<string[]>([])

    useEffect(() => {
        const loadBreeds = async () => {
            try {
                const data = await fetchBreeds()
                setBreeds(data)
            } catch (error) {
                setError('Failed to fetch dog breeds. Please try again.')
                console.log('Failed to fetch dog breeds: ', error)
            }
        }

        loadBreeds()
    }, [])

    useEffect(() => {
        const loadStates = async () => {
            try {
                const data = await searchLocations({
                    size: 10000,
                    from: 0
                })
                const uniqueStates = Array.from(new Set(data.results.map((location) => location.state)))
                setStates(uniqueStates)
            } catch (error) {
                setError('Failed to fetch states. Please try again.')
                console.log('Failed to fetch states: ', error)
            }

        }
        loadStates()
    }, [])

    useEffect(() => {
        const loadCities = async () => {
            try {
                if (selectedState) {
                    const data = await searchLocations({
                        states: [selectedState],
                        size: 10000,
                        from: 0
                    })
                    const uniqueCities = Array.from(new Set(data.results.map((location) => location.city)))
                    setCities(uniqueCities)
                }
            } catch (error) {
                setError('Failed to fetch Cities. Please try again.')
                console.log('Failed to fetch cities: ', error)
            }
        }
        loadCities()
    }, [selectedState])

    useEffect(() => {
        const loadDogs = async () => {
            setLoading(true)
            try {
                const data: FetchDogsResponse = await fetchDogs(filters)
                const dogDetails = await fetchDogDetails(data?.resultIds)
                setDogs(dogDetails)
                setTotal(data.total)
                setPrevPage(data.prev || null)
                setNextPage(data.next || null)
                setError(null)
            } catch (error) {
                setError('Failed to fetch dogs. Please try again.')
                console.log('Failed to fetch dogs: ', error)
            } finally {
                setLoading(false)
            }
        }
        loadDogs()
    }, [filters])

    const handleNextPage = async () => {
        if (nextPage) {
            // setFilters((prev) => ({
            //     ...prev,
            //     from: (prev?.from || 0) + (prev?.size || 25),
            // }))
            setLoading(true)
            try {
                const data: FetchDogsResponse = await fetchDogsWithAppendUrl(nextPage)
                const dogDetails = await fetchDogDetails(data?.resultIds)
                setDogs(dogDetails)
                setTotal(data.total)
                setPrevPage(data.prev || null)
                setNextPage(data.next || null)
                setError(null)
            } catch (error) {
                setError('Failed to fetch dogs. Please try again.')
                console.log('Failed to fetch dogs: ', error)
            } finally {
                setLoading(false)
            }
        }
    }

    const handlePreviousPage = async () => {
        if (prevPage) {
            // setFilters((prev) => ({
            //     ...prev,
            //     from: Math.max(0, (prev?.from || 0) - (prev?.size || 25)),
            // }))
            setLoading(true)
            try {
                const data: FetchDogsResponse = await fetchDogsWithAppendUrl(prevPage)
                const dogDetails = await fetchDogDetails(data?.resultIds)
                setDogs(dogDetails)
                setTotal(data.total)
                setPrevPage(data.prev || null)
                setNextPage(data.next || null)
                setError(null)
            } catch (error) {
                setError('Failed to fetch dogs. Please try again.')
                console.log('Failed to fetch dogs: ', error)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (filters.zipCodes && filters.zipCodes.length > 0) {
            const loadLocations = async () => {
                try {
                    const data = await fetchLocations(filters.zipCodes || [])
                    setLocations(data)
                } catch (error) {
                    setError('Failed to fetch locations. Please try again.')
                    console.log('Failed to fetch locations: ', error)
                }
            }
            loadLocations()
        }

    }, [filters.zipCodes])

    const handleGenerateMatch = async () => {
        if (favorites.length === 0) {
            alert('Please select at least one favorite dog.')
            return
        }
        try {
            const matchResponse: Match = await generateMatch(favorites)
            setMatch(matchResponse.match)
            setIsModalOpen(true)
            setError(null)
        } catch (error) {
            setError('Failed to generate dog match. Please try again')
            console.log('Error generateing dog match', error)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }



    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters((prev) => ({
            ...prev,
            sort: e.target.value
        }))
    }

    const updateZipCodes = async (state: string, city: string) => {
        try {
            const params: SearchLocationsParams = {}
            if (state) {
                params.states = [state]
            }
            if (city) {
                params.city = city
            }

            const data = await searchLocations(params)
            const zipCodes: string[] = Array.from(data.results.map((location) => location.zip_code))
            setFilters((prev) => ({
                ...prev,
                zipCodes
            }))
        } catch (error) {
            setError('Failed to update zipCodes. Please try again')
            console.log('Error updating zipCodes', error)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            onLogout()
        } catch (error) {
            setError('Failed to logout. Please try again')
            console.log('Error Logging Out', error)
        }
    }

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const state = e.target.value
        setSelectedState(state)
        setSelectedCity('')
        updateZipCodes(state, '')
    }

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value
        setSelectedCity(city)
        updateZipCodes(selectedState, city)

    }

    const handleFavorite = (dogId: string) => {
        setFavorites((prev) =>
            prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
        )
    }

    const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBreed = Array.from(e.target.selectedOptions, (option) => option.value)
        const resultBreedSet = selectedBreed.length ? Array.from(new Set([...selectedBreed, ...newBreed])) : newBreed
        setSelectedBreed(resultBreedSet)
        setSelectedState('')
        setSelectedCity('')
        setFilters({ ...filters, breed: resultBreedSet, zipCodes: [] })
    }



    return (
        <div className="search-container">

            <button className="logout-button" onClick={handleLogout}>Logout</button>

            <h1 className="text-view">Search Dogs</h1>
            {/* <div className="search-main-view"> */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p className="text-view"> TOTAL RESULTS: {total}</p>
            <div className="filter-sort-row">
                {/*Breed Filter*/}
                <div >
                    <label className="text-view">FILTER BY BREED: </label>
                    <select multiple value={selectedBreed} onChange={handleBreedChange}>
                        {/* <option value="">ALL BREEDS</option> */}
                        {
                            breeds.map((breed) => (
                                <option key={breed}>{breed}</option>
                            ))
                        }

                    </select>
                </div>

                {/*Location State Filter*/}
                <div>
                    <label className="text-view">STATE</label>
                    <select value={selectedState} onChange={handleStateChange}>
                        <option value="">ALL STATES</option>
                        {
                            states.map((state) => (
                                <option key={state}>{state}</option>
                            ))
                        }

                    </select>

                </div>

                {/*Location City Filter*/}
                {/* {selectedState && */}
                <div>
                    <label className="text-view">CITY</label>
                    <select value={selectedCity} onChange={handleCityChange}>
                        <option value="">ALL CITIES</option>
                        {
                            cities.map((city) => (
                                <option key={city}>{city}</option>
                            ))
                        }

                    </select>
                </div>
                {/* } */}
                {/*Sorting*/}
                <div>
                    <label className="text-view">SORT BY:</label>
                    <select value={filters.sort} onChange={handleSortChange}>
                        <option value="breed:asc">Breed( A-Z )</option>
                        <option value="breed:desc">Breed ( Z-A )</option>
                    </select>
                </div>

            </div>

            {selectedBreed?.length && <div className="select-breeds">
                <strong>SELECTED BREEDS: </strong>
                {selectedBreed.join(', ')}
            </div>
            }

            {/*Dogs List*/}
            {
                loading ? (<p className="text-view">Loading...</p>) :

                    (
                        total === 0 ? (<p className="select-breeds-no-dogs" > NO DOGS AVAILABLE FOR THE GIVEN SEARCH CRITERIA </p>) :

                            (

                                <ul className="dog-grid">
                                    {
                                        dogs.map((dog) => (
                                            <li key={dog.id}>
                                                <DogCard dog={dog} onFavorite={() => handleFavorite(dog.id)} isFavorite={favorites.includes(dog.id)} />
                                            </li>
                                        ))
                                    }
                                </ul>
                            )

                    )
            }

            {/*Pagination*/}

            {total > 0 && <div className="pagination">
                <button onClick={handlePreviousPage} disabled={!prevPage}> &larr; Previous Page </button>
                <button onClick={handleNextPage} disabled={!nextPage}> Next Page &rarr;</button>
            </div>
            }


            {/*Generate Match*/}
            {total > 0 &&
                <div className="generate-match">
                    <button onClick={handleGenerateMatch}>Generate Match</button>
                </div>
            }

            {/*Display Match*/}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>⭐⭐ Congratulations ⭐⭐</h2>
                {match ? (<p className="text-view-black"> Your match is successful.</p>) : (
                    <p style={{ color: 'red' }}>No Match found. Please try again.</p>
                )}
            </Modal>
            {/* </div> */}
        </div>)
}

export default SearchPage