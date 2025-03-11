import React from "react";
import { Dog } from "../../api/types/Dogs";
import './DogCard.css'

interface DogCardProps {
    dog: Dog
    onFavorite: () => void
    isFavorite: boolean
}

const DogCard: React.FC<DogCardProps> = ({ dog, onFavorite, isFavorite }) => {
    return (
        <div className="dog-card">
            <img src={dog.img} alt={dog.name} className="dog-image" />
            <div className="dog-info">
                <div style={{alignItems:'flex-start'}}>
                    <p className="dog-name">{dog?.name}</p>
                    <p className="dog-breed">{dog?.breed}</p>
                    <p className="dog-age">{dog?.age} years old</p>
                </div>
                <button onClick={onFavorite}>{isFavorite ? '⭐' : '☆'}</button>
            </div>
        </div>
    )
}

export default DogCard