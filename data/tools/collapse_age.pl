#!/usr/bin/perl

$line = <STDIN>;
print $line;

%hash = ();
while (<STDIN>)
{
    chomp;
    #split /,/;
    if ($_ =~ /(.+),(".+"),([12]),(.+),([0-9]+)/)
    {

#$key = $_[0].",".$_[1].",".$_[2].",".$_[3];
        if ($4 <= 4)
        {
            $key = $1.",".$2.",".$3.","."0-4";
        }
        else
        {
            $key = $1.",".$2.",".$3.",".$4;
        }
        if (defined $hash{$key} && exists $hash{$key})
        {
            $hash{$key} += $5;
        }
        else
        {
            $hash{$key} = $5;
        }
    }
    else
    {
        print "Error\n";
    }
}

for $key (sort keys %hash)
{
    print $key.",".$hash{$key}."\n";
}
