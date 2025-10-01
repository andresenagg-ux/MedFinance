import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const options = [
  { key: 'STUDENT', label: 'Sou estudante' },
  { key: 'RECENT_GRAD', label: 'Sou recém-formado(a)' },
  { key: 'SPECIALIST', label: 'Sou especialista' },
] as const;

type Profile = 'STUDENT' | 'RECENT_GRAD' | 'SPECIALIST';

type Props = {
  onSelect: (profile: Profile) => void;
  selectedProfile: Profile | null;
  disabled?: boolean;
};

function ProfileSelectorComponent({ onSelect, selectedProfile, disabled }: Props) {
  return (
    <View>
      {options.map(({ key, label }, index) => {
        const isActive = selectedProfile === key;
        return (
          <Pressable
            key={key}
            disabled={disabled}
            style={[
              styles.option,
              isActive && styles.optionActive,
              index < options.length - 1 && styles.optionSpacing,
            ]}
            onPress={() => onSelect(key)}
          >
            <Text style={[styles.optionText, isActive && styles.optionTextActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const ProfileSelector = memo(ProfileSelectorComponent);

const styles = StyleSheet.create({
  option: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  optionSpacing: {
    marginBottom: 12,
  },
  optionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  optionTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
