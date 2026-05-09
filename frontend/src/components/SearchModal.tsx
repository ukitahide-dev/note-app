import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

export default function SearchModal() {
  return (
    <CommandDialog open={false} onOpenChange={() => {}}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={'キーワードで検索'}
          onValueChange={() => {}}
        />
        <CommandList>
          <CommandEmpty>条件に一致するノートがありません</CommandEmpty>
          <CommandGroup>
            <CommandItem>
              <span>ノート1</span>
            </CommandItem>
            <CommandItem>
              <span>ノート2</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
