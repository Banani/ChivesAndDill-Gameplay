export interface Notifier {
   getBroadcast: () => { data: any; key: string; toDelete: string[] };
}
