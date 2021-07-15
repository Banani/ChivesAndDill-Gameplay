export interface MonsterTemplate {
   id: string;
   name: string;
   sprites: string;
   size: number;
   healthPoints: number;
   division: string;
}

export const MonsterTemplates: Record<string, MonsterTemplate> = {
   PigSlut: {
      id: 'PigSlut',
      name: 'PigSlut',
      sprites: 'pigMan',
      size: 50,
      healthPoints: 60,
      division: 'PigSlut',
   },
   PigFucker: {
      id: 'PigFucker',
      name: 'PigFucker',
      sprites: 'pigMan',
      size: 50,
      healthPoints: 200,
      division: 'PigFucker',
   },
};
