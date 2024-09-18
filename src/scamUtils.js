
import yaml from 'js-yaml';

// Fetch the scams.yaml file from the public directory using fetch
export const fetchScamsYaml = async () => {
  try {
    const response = await fetch('data/scams.yaml');  // Relative URL to the public folder
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const yamlText = await response.text();  // Get the YAML content as text
    const scamList = yaml.load(yamlText);    // Parse the YAML content to a JS object
    return scamList;
  } catch (error) {
    console.error('Error fetching scams.yaml file:', error);
    throw error;
  }
};

fetchScamsYaml();