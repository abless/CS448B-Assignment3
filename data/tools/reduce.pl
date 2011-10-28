#!/usr/bin/perl

$line = <STDIN>;
print $line;

%hash = ();
while (<STDIN>)
{
    chomp;
    split /,/;
    $key = $_[0].",".$_[1].",".$_[2].",".$_[3];
    if (defined $hash{$key} && exists $hash{$key})
    {
        $hash{$key} += $_[4];
    }
    else
    {
        $hash{$key} = $_[4];
    }
}

for $key (sort keys %hash)
{
    print $key.",".$hash{$key}."\n";
}
