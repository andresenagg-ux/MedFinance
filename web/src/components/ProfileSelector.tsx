import '../styles/ProfileSelector.css';

const options = [
  { key: 'STUDENT', label: 'Sou estudante' },
  { key: 'RECENT_GRAD', label: 'Sou recém-formado(a)' },
  { key: 'SPECIALIST', label: 'Sou especialista' },
] as const;

type Props = {
  onSelect: (profile: 'STUDENT' | 'RECENT_GRAD' | 'SPECIALIST') => void;
  selectedProfile: string | null;
  disabled?: boolean;
};

function ProfileSelector({ onSelect, selectedProfile, disabled }: Props) {
  return (
    <div className="profile-selector">
      {options.map(({ key, label }) => {
        const isActive = selectedProfile === key;
        return (
          <button
            key={key}
            className={`profile-option ${isActive ? 'active' : ''}`}
            disabled={disabled}
            onClick={() => onSelect(key)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default ProfileSelector;
