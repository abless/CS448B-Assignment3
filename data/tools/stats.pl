#!/usr/bin/perl

$line = <STDIN>;

my %causes = ();
while(<STDIN>)
{
    chomp;
    @line = split(/,/, $_);
    $causes{$line[1]} += $line[4];
#    print $line[0];
}

foreach $key (sort {$causes{$b} <=> $causes{$a} } keys %causes)
{
    print $key.";".$causes{$key}."\n";
}
