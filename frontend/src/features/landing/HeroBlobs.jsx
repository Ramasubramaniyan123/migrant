import { ReactComponent as SVGGroup } from '../../../assets/icons/group.svg'

export const HeroBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(45, 55, 72, 0.15)"/>
          </filter>
        </defs>
        <g filter="dropShadow">
          <circle cx="200" cy="300" r="300" fill="rgba(45, 55, 72, 0.08)" />
          <circle cx="800" cy="700" r="250" fill="rgba(237, 137, 54, 0.08)" />
          <circle cx="500" cy="100" r="350" fill="rgba(237, 137, 54, 0.05)" />
        </g>
      </svg>
    </div>
  )
}